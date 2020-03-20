import { Box, Button, Grid, withStyles, WithStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import _ from "lodash";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { GroupTag } from "../../../state/ducks/auth/types";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { DocumentRevision, DocumentRevisionStatus, RevisionStageOptions } from "../../../state/ducks/documentRevisions";
import { DocumentTypeByIdState } from "../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../state/ducks/documents";
import { userManagementActions, userManagementSelectors } from "../../../state/ducks/userManagement";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import OwnerChanger from "../../components/common/owner.changer/container";
import { RequestType } from "../../components/common/owner.changer/helpers/types";
import AutcompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../components/forms/fields/Autocomplete/types.js";
import CheckboxField from "../../components/forms/fields/Checkbox";
import RichTextEditor from "../../components/forms/fields/RichTextEditor";
import SelectField, { SelectOption } from "../../components/forms/fields/Select";
import { required, validator } from "../../components/forms/fields/validators";
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
import FBWorkspaceForm from "../../form.builder/containers/workspace/FBWorkspaceForm";
import { FBValidate } from "../../form.builder/defaults/validator";
import FBDRStore from "../../form.builder/stores/ui/FBDRStore";
import FBStore from "../../form.builder/stores/ui/FBStore";
import useActionCreator from "../../hooks/useActionCreator";
import DocumentRevisionOutputInfo from "../formBuilder/DocumentRevisionOutputInfo";
import styles from "./DocumentRevisionForm.styles";
import ApproveAndRelease from "./presenters/ApproveAndRelease";
import DocIdInput from "./presenters/DocIdInput";
import GenerateHtmlPreview from "./presenters/GenerateHtmlPreview";
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
  otherDocumentTypes: SelectOption[];
  documentTypesById: DocumentTypeByIdState;
  onDirtyFlagChange?: (dirty: boolean) => void;
  canChangeOwnerShip: boolean;
  onUpgradeClick: () => void;
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
  otherDocumentTypes,
  canChangeOwnerShip,
  documentRevision,
  setFieldValue,
  onUpgradeClick,
}) => {
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

  if (!values.id && !_.get(values, "document.documentType.id")) {
    FBDRStore.setMode("none");
    if (setDocId) {
      setDocId("");
    }
  }

  const openReference = (documentId: string) => {
    window.open(documentDetailsPath(documentId), "_blank");
  };

  const isDisabled: boolean = _.get(initialValues, "id") !== undefined;
  const isdocRevVersionOne = _.get(documentRevision, "version") === 1;
  const isdocRevStatusDraft =
    _.get(documentRevision, "status") === DocumentRevisionStatus.Draft;
  const outputDocEnabled: boolean =
    (isdocRevVersionOne && isdocRevStatusDraft) || !isDisabled;

  useEffect(() => {
    if (proposedDocId) {
      setFieldValue("document.docId", proposedDocId);
    }
    if (_.isEmpty(values.document?.documentType?.id)) {
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
      loadDocumentProposedId(type.documentTypeAcronym);
    }
    FBDRStore.setInitialFBMode(type.group);
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

  const upgradeButtonRenderer = () => (
    <Button
      variant="outlined"
      onClick={onUpgradeClick}
      id="DocumentRevisionForm-upgrade"
    >
      <Text translation="common.upgrade"/>
    </Button>
  );

  const isReadyForUpgrade = documentRevision.formDocument?.status === DocumentRevisionStatus.Deprecated;

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
            inputProps: { id: "documentType", disabled: isDisabled },
            onChange: handleTypeChange,
          }}
          options={documentTypes}
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
        <AutcompleteField
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
        />
        <AttachmentsField />
        {renderTypeOfRevisionChange}
        {!values.status && (
          <AsyncGate
            asyncState={loadApproversAsyncState}
            asyncAction={loadAvailableApproversAction}
            startActionOnMount={true}
          >
            <AutcompleteField
              name="securityEmployees"
              label="document.revision.user.permissions"
              autocompleteProps={{
                id: "securityEmployees",
                isMulti: true,
                closeMenuOnSelect: false,
              }}
              options={availableApprovers}
            />
          </AsyncGate>
        )}
        {!values.status && (
          <AsyncGate
            asyncState={loadGroupAsyncState}
            asyncAction={loadGroupsAction}
            startActionOnMount={true}
          >
            <AutcompleteField
              name="securityGroups"
              label="document.revision.group.permissions"
              autocompleteProps={{
                id: "securityGroups",
                isMulti: true,
                closeMenuOnSelect: false,
              }}
              options={groupOptions}
            />
          </AsyncGate>
        )}
        {FBStore.active && !FBDRStore.isOutput && (
          <Box mt={4}>
            <SelectField
              name="formTemplate.outputDocumentType.id"
              label="document.output.type"
              selectProps={{
                inputProps: {
                  id: "formTemplate.outputDocumentType",
                  disabled: !outputDocEnabled,
                  className: !outputDocEnabled ? classes.outputGrey : "",
                },
              }}
              options={otherDocumentTypes}
              includeEmpty={false}
              validate={validator(required)}
            />
            <RenderHtmlField />
          </Box>
        )}
        {FBStore.active && (
          <Box mt={5}>
            <GenerateHtmlPreview id={values.id} renderHTML={values.formDocument?.renderHTML} />
            <FBWorkspaceForm
              id={_.get(values, "id")}
              documentId={_.get(values, "formDocument.document.id") || _.get(values, "document.id")}
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
            {renderChangeOwnership}
            <SubmitButton
              asyncState={asyncState}
              label={isDisabled ? "common.save" : "navigation.createDocument"}
              onClick={onFormClick}
              id="DocumentRevisionForm-submit"
            />
            {isReadyForUpgrade && upgradeButtonRenderer()}
            <ApproveAndRelease
              id={values.id}
              status={values.status}
              isQms={docInfo.isQms}
              documentName={docInfo.name}
            />
          </Grid>
        </Box>
      </FormWrapper>
    </Grid>
  );
};

export default withStyles(styles)(observer(DocumentRevisionFormPresenter));
