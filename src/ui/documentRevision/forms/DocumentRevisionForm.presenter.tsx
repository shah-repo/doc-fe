import { Box, Grid, withStyles, WithStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import { isEmpty } from "lodash";
import { observer } from "mobx-react";
import React, { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { GroupTag } from "../../../state/ducks/auth/types";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType, RevisionStageOptions } from "../../../state/ducks/documentRevisions";
import { DocumentTypeByIdState } from "../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../state/ducks/documents";
import { userManagementActions, userManagementSelectors } from "../../../state/ducks/userManagement";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
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
import AttachmentsField from "../../document.revision/form/attachments";
import Title from "../../document.revision/form/title";
import FormHeader from "../../document.revision/header/FormHeader";
import { documentDetailsPath } from "../../document.revision/utils/paths";
import FBDRStore from "../../form.builder/stores/ui/FBDRStore";
import FBStore from "../../form.builder/stores/ui/FBStore";
import useActionCreator from "../../hooks/useActionCreator";
import DocumentRevisionOutputInfo from "../formBuilder/DocumentRevisionOutputInfo";
import styles from "./DocumentRevisionForm.styles";
import DocIdInput from "./presenters/DocIdInput";
import GenerateHtmlPreview from "./presenters/GenerateHtmlPreview";
import MemoizedFBWorkspace from "./presenters/MemoizedFBWorkspace";
import References from "./presenters/References";
import RenderHtmlField from "./presenters/RenderHtmlField";
import RevisionTypeChange from "./presenters/RevisionTypeChange";
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

  if (!values.id && !values.document?.documentType?.id) {
    FBDRStore.setMode("none");
    if (setDocId) {
      setDocId("");
    }
  }

  const openReference = (documentId: string) => {
    window.open(documentDetailsPath(documentId), "_blank");
  };
  const isDisabled: boolean = initialValues.id !== undefined;
  const isdocRevVersionOne = documentRevision?.version === 1;
  const isdocRevStatusDraft =
    documentRevision?.status === DocumentRevisionStatus.Draft;
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
  const isDocTypeDisabled = type === "newVersion" || isdocRevStatusDraft;
  const options = useMemo(() => type === "newOutput" ?
    (initialValues.formDocument?.formTemplate?.outputDocumentTypes.map((e) =>
      ({ value: e.id, text: e.documentTypeName })
    ) as SelectOption[] || documentTypes)
    : documentTypes
  , [documentTypes, initialValues.formDocument, type]);

  return (
    <Grid
      item={true}
      className={classes.container}
      lg={isDisabled ? 12 : 7}
      sm={isDisabled ? 12 : 10}
      xs={12}
    >
      <FormHeader
        {...{ documentRevision, handleCancelDraft, canChangeOwnerShip, values, onUpgradeClick, docInfo, isDisabled, asyncState }}
      />
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
            <MemoizedFBWorkspace
              id={values.id}
              documentId={values.formDocument?.document?.id || values.document?.id}
              document={values as unknown as DocumentRevision}
            />
          </Box>
        )}
      </FormWrapper>
    </Grid>
  );
};

export default withStyles(styles)(observer(DocumentRevisionFormPresenter));
