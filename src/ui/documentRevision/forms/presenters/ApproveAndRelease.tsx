import { Button, createStyles, Dialog, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import { flatten } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getHasPermission } from "../../../../common/utils/selectors";
import { Group, Permission } from "../../../../state/ducks/auth/types";
import { ChangeRequest, changeRequestsActions } from "../../../../state/ducks/changeRequest";
import { Owner } from "../../../../state/ducks/common/types";
import { documentRevisionsActions, documentRevisionsSelectors, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { documentTypeActions, DocumentTypeById } from "../../../../state/ducks/documentRevisions/documentType";
import { ApplicationState } from "../../../../state/reducers";
import { toChangeRequestEditRequestBody } from "../../../change.request/form/transform";
import { TemplateOption } from "../../../change.request/form/types";
import { changeRequestEditPath } from "../../../change.request/utils/paths";
import { FormContext } from "../../../components/forms/FormContext";
import Text from "../../../components/Text";
import { FB } from "../../../form.builder";
import { useApproveAndRelease } from "../../../hooks/docCustomization/useCustomization";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { ApproveAndReleaseFormValues } from "../types";
import ApproveAndReleaseForm from "./ApproveAndReleaseForm";

interface Props {
  id?: string;
  status?: DocumentRevisionStatus;
  isQms: boolean;
  documentName: string;
  docRevId: string;
  owner?: Owner;
  documentTypeId?: string;
}

const styles = makeStyles(() =>
  createStyles({
    dialogPaper: {
      overflowY: "unset",
    },
    dialogContent: {
      overflowY: "unset",
    },
  },
  ));

export const ApproveAndRelease: React.FunctionComponent<Props> = ({
  id,
  status,
  isQms,
  documentName,
  docRevId,
  owner,
  documentTypeId,
}) => {
  const [isVisible, label] = useApproveAndRelease(documentTypeId);
  const classes = styles();
  const dialog = useDialog();
  const releaseAction = useActionCreator(documentRevisionsActions.approveAndRelease);
  const releaseNonQmsAction = useActionCreator(documentRevisionsActions.approveAndReleaseNonQms);
  const async = useAsync<any>({ onSuccess: dialog.close });
  const canApprove = useSelector(getHasPermission(Permission.CR_OWNER_AS_APPROVER));
  const [documentTypeGroups, setDocTypeGroups] = useState<any[]>([]);
  const getDocTypeByGroupAction = useActionCreator(documentTypeActions.getDocTypeByGroup);
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [formDocument, setFormDocument] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");
  const [selectedInvalid, setSelectedInvalid] = useState<boolean>(false);
  const create = useActionCreator(changeRequestsActions.create);
  const documentRevision = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, docRevId));
  const history = useHistory();

  const asyncGroups = useAsync({
    onSuccess: (response: Group[] = []) => {
      setDocTypeGroups([
        response,
      ].flat());
    },
  });

  const getGroupsByStage = useActionCreator(documentRevisionsActions.loadGroupsByStage);

  const asyncGetDocTypeByGroup = useAsync({
    onSuccess: (data: DocumentTypeById[] = []) => {
      const options = flatten(
        data.map((template) =>
          template.forms.map((form) => ({
            label: form.name,
            value: form.id,
            docTypeId: template.documentType.id,
            schema: form.formTemplate?.schema,
            formInput: form.formInput,
          }))
        )
      );
      setTemplateOptions(options);
    },
  });

  useEffect(() => {
    if (!docRevId) {
      return;
    }
    asyncGroups.start(
      getGroupsByStage,
      docRevId,
      asyncGroups,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docRevId]);

  const openDialog = () => {
    async.reset();
    asyncGroups.start(
      getGroupsByStage,
      docRevId,
      asyncGroups,
    );
    asyncGetDocTypeByGroup.start(
      getDocTypeByGroupAction,
      { docTypeGroupOption: "CHANGE_REQUEST" },
      asyncGetDocTypeByGroup);
    dialog.open();
  };

  const closeDialog = () => {
    setFormDocument("");
    setDocumentType("");
    dialog.close();
  };

  const asyncAR = useAsync<ChangeRequest>({
    onSuccess: (createdChangeRequest?) => {
      createdChangeRequest && history.push(changeRequestEditPath(createdChangeRequest.id));
    },
  });

  const initialValuesAR = (values: any): any => ({
    title: documentRevision.name,
    description: documentRevision.name,
    documentType: {
      id: values.formDocument.documentType,
    },
    formDocument: {
      id: values.formDocument.value,
    },
    formInput: {
      approvers: values.approvals
        .map((approval) => approval.value)
        .concat(owner?.id).filter((id) => id)
        .map((id) => ({ id })),
      documentRevisions: [{
        descriptionOfChange: values.formDocument.label,
        id: FB.uniqid,
        justificationOfChange: values.formDocument.label,
        proposedDocumentRevision: { id: docRevId },
      }],
      effectiveDate: values.effectiveDate,
    },
  });

  const onSubmit = (values: any) => {
    if (selectedInvalid) {
      asyncAR.start(create, toChangeRequestEditRequestBody(initialValuesAR(values)), asyncAR);
      return;
    }

    const approvers = !values.approvals || values.approvals.length === 0 ?
      undefined :
      values.approvals.map((approver) => ({ id: approver.value }));
    const effectiveDate = values.effectiveDate;

    if (!isQms) {
      async.start(
        releaseNonQmsAction,
        id,
        {
          approvers,
          effectiveDate,
          documentType: { id: documentType },
          formDocument: { id: formDocument },
        },
        async,
      );
      return;
    }
    async.start(
      releaseAction,
      id,
      { approvers, effectiveDate, documentType: { id: documentType }, formDocument: { id: formDocument } },
      async,
    );
  };

  if (!id || status !== DocumentRevisionStatus.Draft || !canApprove) {
    return null;
  }

  const transformedDocTypeGroups = [].concat(...documentTypeGroups);
  const initialValues = {
    password: "",
    effectiveDate: (new Date()).toISOString(),
    approvals: [],
    formDocument: { id: "" },
    documentType: { id: "" },
  };


  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const renderForm = (props: FormikProps<ApproveAndReleaseFormValues>) => (
    <ApproveAndReleaseForm
      {...props}
      asyncState={selectedInvalid ? asyncAR.asyncState : async.asyncState}
      cancel={closeDialog}
      isQms={isQms}
      documentTypeGroups={transformedDocTypeGroups}
      owner={owner as Owner}
      templateOptions={templateOptions}
      setFormDocument={setFormDocument}
      setDocumentType={setDocumentType}
      {...{ closeDialog, setSelectedInvalid, selectedInvalid }}
    />
  );

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <Button
        color="secondary"
        variant="outlined"
        onClick={openDialog}
        id="ApproveAndRelease-button"
        data-cy="ApproveAndRelease-button"
      >
        <Text message={label} />
      </Button>
      {
        dialog.isOpen &&
        <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          fullWidth={true}
          maxWidth="xs"
          open={dialog.isOpen}
          onSubmit={preventPropagation}
          classes={{ paper: classes.dialogContent }}
          id="ApproveAndRelease-dialog"
        >
          <DialogTitle>
            {isQms && <Text translation="common.approve.and.release" />}
            {!isQms && <Text translation="common.warning.message" values={{ name: documentName }} />}
          </DialogTitle>
          <DialogContent
            classes={{ root: classes.dialogContent }}
            id="ApproveAndRelease-content"
          >
            <FormContext.Provider value={{ submitOnChange: false }}>
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
              >
                {renderForm}
              </Formik>
            </FormContext.Provider>
          </DialogContent>
        </Dialog>
      }
    </>
  );
};

export default ApproveAndRelease;
