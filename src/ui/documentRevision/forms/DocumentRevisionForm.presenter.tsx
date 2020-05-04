import { Box, Button, Grid, withStyles, WithStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import { get, isEmpty } from "lodash";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { GroupTag } from "../../../state/ducks/auth/types";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { Document, DocumentRevision, documentRevisionsActions, documentRevisionsSelectors, DocumentRevisionStatus, RevisionChangeType, RevisionStageOptions } from "../../../state/ducks/documentRevisions";
import { DocumentTypeByIdState } from "../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../state/ducks/documents";
import { userManagementActions, userManagementSelectors } from "../../../state/ducks/userManagement";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import OwnerChanger from "../../components/common/owner.changer/container";
import { RequestType } from "../../components/common/owner.changer/helpers/types";
import { default as AutocompleteField } from "../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../components/forms/fields/Autocomplete/types.js";
import CheckboxField from "../../components/forms/fields/Checkbox";
import RichTextEditor from "../../components/forms/fields/RichTextEditor";
import SelectField, { SelectOption } from "../../components/forms/fields/Select";
import { required, requiredAtLeastOne, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import FormWrapper from "../../components/forms/FormWrapper";
import PromptIfDirty from "../../components/forms/PromptIfDirty";
import ScrollToError from "../../components/forms/ScrollToError";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import AttachmentsField from "../../document.revision/form/attachments";
import Title from "../../document.revision/form/title";
import { documentDetailsPath } from "../../document.revision/utils/paths";
import { FBWorkspace } from "../../form.builder";
import { FBValidate } from "../../form.builder/defaults/validator";
import FBDRStore from "../../form.builder/stores/ui/FBDRStore";
import FBStore from "../../form.builder/stores/ui/FBStore";
import useActionCreator from "../../hooks/useActionCreator";
import DocumentRevisionOutputInfo from "../formBuilder/DocumentRevisionOutputInfo";
import { getIsLastVersionObsolete } from "../helpers";
import styles from "./DocumentRevisionForm.styles";
import ApproveAndRelease from "./presenters/ApproveAndRelease";
import DocIdInput from "./presenters/DocIdInput";
import GenerateHtmlPreview from "./presenters/GenerateHtmlPreview";
import References from "./presenters/References";
import RenderHtmlField from "./presenters/RenderHtmlField";
import RevisionTypeChange from "./presenters/RevisionTypeChange";
import UpgradeToLatest from "./presenters/UpgradeToLatest";
import { DocumentRevisionFormValues } from "./types";


export interface Props
  extends WithStyles<typeof styles>,
  FormikProps<DocumentRevisionFormValues> {
  asyncState: AsyncState;
  documentRevision: DocumentRevision;
  documentRevisions?: DocumentRevision[];
  availableReferences: OptionType[];
  showRevisionTypeChange?: boolean;
  loadDocumentProposedId?: typeof documentsActions.loadDocumentProposedId;
  proposedDocId?: string;
  setDocId?: typeof documentsActions.setDocumentProposedId;
  doNotPrompt?: boolean;
  documentTypes: SelectOption[];
  outputDocumentTypeOptions: OptionType[];
  documentTypesById: DocumentTypeByIdState;
  onDirtyFlagChange?: (dirty: boolean) => void;
  canChangeOwnerShip: boolean;
  onUpgradeClick: () => void;
  type?: string;
  handleCancelDraft: () => void;
}

export const DocumentRevisionFormPresenter: React.FunctionComponent<Props> = ({
  classes,
  asyncState,
  initialValues,
  handleChange,
  availableReferences,
  showRevisionTypeChange,
  loadDocumentProposedId,
  proposedDocId,
  values,
  setDocId,
  dirty,
  resetForm,
  doNotPrompt,
  onDirtyFlagChange,
  isSubmitting,
  isValidating,
  errors,
  documentTypes,
  documentTypesById,
  outputDocumentTypeOptions,
  canChangeOwnerShip,
  documentRevision,
  setFieldValue,
  onUpgradeClick,
  type,
  handleCancelDraft,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const loadAvailableApproversAction = useActionCreator(
    changeRequestsActions.loadAvailableApprovers
  );
  const loadApproversAsyncState = useSelector(
    changeRequestsSelectors.getLoadApproversAsyncState
  );
  const loadGroupsAction = useActionCreator(
    userManagementActions.loadCompanyGroups
  );
  const loadGroupAsyncState = useSelector(
    userManagementSelectors.getLoadGroupsAsyncState
  );

  if (!values.id && !get(values, "document.documentType.id")) {
    FBDRStore.setMode("none");
    if (setDocId) {
      setDocId("");
    }
  }

  const openReference = (documentId: string) => {
    window.open(documentDetailsPath(documentId), "_blank");
  };
  const formDocumentId = documentRevision && (documentRevision.formDocument?.document?.id || "");
  const formDocuments: Document = useSelector((state: ApplicationState) => documentRevisionsSelectors.getDocument(state, formDocumentId));
  const isLastVersionObsolete = formDocuments && getIsLastVersionObsolete(formDocuments);

  useEffect(() => {
    if (formDocumentId) {
      dispatch(documentRevisionsActions.loadDocument(formDocumentId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDocumentId]);
  const isDisabled: boolean = get(initialValues, "id") !== undefined;
  const isdocRevVersionOne = get(documentRevision, "version") === 1;
  const isdocRevStatusDraft =
    get(documentRevision, "status") === DocumentRevisionStatus.Draft;
  const outputDocEnabled: boolean =
    (isdocRevVersionOne && isdocRevStatusDraft) || !isDisabled;

  useEffect(() => {
    if (proposedDocId) {
      setFieldValue("document.docId", proposedDocId);
    }
    if (isEmpty(values.document?.documentType?.id)) {
      setFieldValue("document.docId", "");
    }
  }, [values.document, proposedDocId, setFieldValue]);

  const [docInfo, savedocInfo] = React.useState({ name: "", isQms: true });

  useEffect(() => {
    if (isdocRevStatusDraft) {
      savedocInfo({
        name: values.name,
        isQms: values.document?.documentType?.isQms || false,
      });
    }
  }, [isdocRevStatusDraft, values.document, values.name]);

  useEffect(() => {
    if (values.revisionChangeType === RevisionChangeType.AdministrativeChange) {
      setFieldValue("retrain", false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.revisionChangeType]);

  const handleTypeChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const typeId = event.target.value as string;
    const type = documentTypesById[typeId] || {};
    savedocInfo({ name: event.target.name || "", isQms: type.isQms });
    groupOptions.forEach((group) => {
      if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
        setFieldValue("securityGroups", [
          { value: group.value, label: group.label },
        ]);
      }
    });
    if (loadDocumentProposedId) {
      setFieldValue("retrain", type.defaultTraining);
      loadDocumentProposedId(type.id);
    }
    FBDRStore.setInitialFBMode(type);
    if (type.isQms) {
      groupOptions.forEach((group) => {
        if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
          setFieldValue("securityGroups", [
            { value: group.value, label: group.label },
          ]);
        }
      });
    }
    if (!type.isQms) {
      setFieldValue("securityGroups", []);
    }
    handleChange(event);
  };

  const onFormClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    FBValidate();
  };

  const renderTypeOfRevisionChange = showRevisionTypeChange && (
    <RevisionTypeChange />
  );

  const availableApprovers = useSelector((state: ApplicationState) => {
    const currentUserId = authSelectors.currentUserId(state);
    return changeRequestsSelectors.getApproversListWithoutCurrentUser(
      state,
      currentUserId
    );
  });
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);


  const renderChangeOwnership = canChangeOwnerShip && values.id && (
    <OwnerChanger requestId={values.id} requestType={RequestType.Document} />
  );

  const renderRevisionStageDropdown = !isDisabled && (
    <SelectField
      name="revisionStage"
      label="document.revision.stage"
      selectProps={{ inputProps: { id: "revisionStage" } }}
      options={RevisionStageOptions}
      validate={validator(required)}
      includeEmpty={false}
    />
  );
  const CancelButtonRenderer = () => (
    <Button id="cancelDraftButton" variant="outlined" onClick={handleCancelDraft}>
      <Text translation="common.cancel.draft" />
    </Button>
  );
  const formDocumentStatus = get(documentRevision, "formDocument.status", "");
  const documentStatus = documentRevision && documentRevision.status;
  const isDocumentStatusDraftOrPending =
    documentStatus === (DocumentRevisionStatus.Draft || DocumentRevisionStatus.PendingChange);
  const isFormStatusDeprecated = formDocumentStatus === DocumentRevisionStatus.Deprecated;
  const isDocTypeDisabled = type === "newVersion" || isdocRevStatusDraft;
  const options = type === "newOutput" ? (initialValues.formDocument?.formTemplate?.outputDocumentTypes.map((e) =>
    ({ value: e.id, text: e.documentTypeName })
  ) as SelectOption[] || documentTypes) : documentTypes;

  const canShowCancelButton = documentStatus === DocumentRevisionStatus.Draft && documentRevision.version > 1;

  return (
    <Grid
      item={true}
      className={classes.container}
      lg={isDisabled ? 12 : 7}
      sm={isDisabled ? 12 : 10}
      xs={12}
    >
      {FBDRStore.isOutput && (
        <DocumentRevisionOutputInfo
          dataProp={(values as unknown) as DocumentRevision}
        />
      )}
      <FormWrapper
        dirty={dirty}
        initialValues={initialValues}
        resetForm={resetForm}
      >
        <ScrollToError
          isSubmitting={isSubmitting}
          isValidating={isValidating}
          errors={errors}
        />
        <PromptIfDirty
          dirty={dirty}
          doNotPrompt={doNotPrompt}
          onDirtyFlagChange={onDirtyFlagChange}
        />
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
        <Title name="name" label="common.title" />
        <RichTextEditor
          name="description"
          label="common.description"
          validate={docInfo.isQms ? validator(required) : undefined}
          editorProps={{
            placeholder: docInfo.isQms
              ? ""
              : "Optional: Title will be used if description not provided.",
          }}
        />
        <SelectField
          name="document.documentType.id"
          label="document.type"
          selectProps={{
            inputProps: { id: "documentType", disabled: isDocTypeDisabled },
            onChange: handleTypeChange,
          }}
          options={options}
          validate={validator(required)}
          includeEmpty={false}
        />
        <DocIdInput
          document={values.document}
          isDisabled={isDisabled}
          documentTypesById={documentTypesById}
          setDocId={setDocId}
        />
        {renderRevisionStageDropdown}
        <AutocompleteField
          name="referenceTo"
          label="documentRevision.form.references"
          autocompleteProps={{
            id: "referenceTo",
            isMulti: true,
            closeMenuOnSelect: false,
          }}
          options={availableReferences}
          onClick={openReference}
        />
        <References document={initialValues.document} />
        <CheckboxField
          name="retrain"
          label="document.revision.trainingRequired"
          checkboxProps={{
            disabled: values.revisionChangeType === RevisionChangeType.AdministrativeChange,
          }}
        />
        <AttachmentsField />
        {renderTypeOfRevisionChange}
        {(!values.status || type === "newOutput") && (
          <AsyncGate
            asyncState={loadApproversAsyncState}
            asyncAction={loadAvailableApproversAction}
            startActionOnMount={true}
          >
            <AutocompleteField
              name="securityEmployees"
              label="document.revision.selected.users"
              autocompleteProps={{
                id: "securityEmployees",
                isMulti: true,
                closeMenuOnSelect: false,
                placeholder: intl.formatMessage({
                  id: "document.revision.selected.users.placeholder",
                }),
              }}
              options={availableApprovers}
            />
          </AsyncGate>
        )}
        {(!values.status || type === "newOutput") && (
          <AsyncGate
            asyncState={loadGroupAsyncState}
            asyncAction={loadGroupsAction}
            startActionOnMount={true}
          >
            <AutocompleteField
              name="securityGroups"
              label="document.revision.selected.groups"
              autocompleteProps={{
                id: "securityGroups",
                isMulti: true,
                closeMenuOnSelect: false,
                placeholder: intl.formatMessage({
                  id: "document.revision.selected.groups.placeholder",
                }),
              }}
              options={groupOptions}
            />
          </AsyncGate>
        )}
        {FBStore.active && !FBDRStore.isOutput && (
          <Box mt={4}>
            <AutocompleteField
              name="formTemplate.outputDocumentTypes"
              label="document.output.type"
              autocompleteProps={{
                id: "formTemplate.outputDocumentTypes",
                isMulti: true,
                closeMenuOnSelect: false,
                className: !outputDocEnabled ? classes.outputGrey : "",
              }}
              options={outputDocumentTypeOptions}
              validate={validator(requiredAtLeastOne)}
            />
            <RenderHtmlField />
          </Box>
        )}
        {FBStore.active && (
          <Box mt={5}>
            {
              values.id &&
              <Box textAlign="right">
                <GenerateHtmlPreview id={values.id} renderHTML={values.formDocument?.renderHTML} />
              </Box>
            }
            <FBWorkspace
              // OLD: to be removed
              id={get(values, "id")}
              documentId={get(values, "formDocument.document.id") || get(values, "document.id")}
              document={values as unknown as DocumentRevision}
              initialValues={values.formInput}
            />
          </Box>
        )}
        <Box mt={5}>
          <Grid
            container={true}
            alignItems="flex-end"
            justify="flex-end"
            direction="row"
          >
            { canShowCancelButton &&  CancelButtonRenderer()}
            {renderChangeOwnership}
            <SubmitButton
              asyncState={asyncState}
              label={isDisabled ? "common.save" : "navigation.createDocument"}
              onClick={onFormClick}
              id="DocumentRevisionForm-submit"
            />
            {isFormStatusDeprecated && isDocumentStatusDraftOrPending && !isLastVersionObsolete && <UpgradeToLatest onUpgradeClick={onUpgradeClick}/>}
            <ApproveAndRelease
              id={values.id}
              status={values.status}
              isQms={docInfo.isQms}
              documentName={docInfo.name}
              docRevId={values.id as string}
            />
          </Grid>
        </Box>
      </FormWrapper>
    </Grid>
  );
};

export default withStyles(styles)(observer(DocumentRevisionFormPresenter));
