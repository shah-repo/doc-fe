import { Button, createStyles, Dialog, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import { concat, filter, find, flatten, includes, sortBy, uniqBy } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getStartOfDayDateString, TIME_ZONE } from "../../../../../common/utils/date";
import { getHasPermission } from "../../../../../common/utils/selectors";
import { Group, Permission } from "../../../../../state/ducks/auth/types";
import { ChangeRequest, changeRequestsActions } from "../../../../../state/ducks/changeRequest";
import { Owner } from "../../../../../state/ducks/common/types";
import { documentRevisionsActions, documentRevisionsSelectors, DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions";
import { documentTypeActions, DocumentTypeById } from "../../../../../state/ducks/documentRevisions/documentType";
import { ApplicationState } from "../../../../../state/reducers";
import AlertDialog from "../../../../app/alert.dialog/AlertDialog";
import { toChangeRequestEditRequestBody } from "../../../../change.request/form/transform";
import { ApproverPayload, TemplateOption } from "../../../../change.request/form/types";
import { changeRequestEditPath } from "../../../../change.request/utils/paths";
import { FormContext } from "../../../../components/forms/FormContext";
import Text from "../../../../components/Text";
import { FB } from "../../../../form.builder";
import CustomLabelTooltip from "../../../../hooks/docCustomization/CustomLabelTooltip";
import { useApproveAndRelease } from "../../../../hooks/docCustomization/useCustomization";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import useDialog from "../../../../hooks/useDialog";
import { checkIsDocumentPO } from "../../../helpers/checkDocumentGroup";
import { ApproveAndReleaseFormValues } from "../../types";
import ApproveAndReleaseForm from "./ApproveAndReleaseForm";

interface Props {
  id?: string;
  status?: DocumentRevisionStatus;
  isQms: boolean;
  documentName: string;
  docRevId: string;
  owner?: Owner;
  documentTypeId?: string;
  revisionStage?: number;
  isRecord: boolean;
  isInlineApproval: boolean;
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

const ApproveAndRelease: React.FunctionComponent<Props> = ({
  id,
  status,
  isQms,
  documentName,
  docRevId,
  owner,
  documentTypeId,
  revisionStage,
  isRecord,
  isInlineApproval,
}) => {

  // MARK: @selectors
  const canApprove = useSelector(getHasPermission(Permission.CR_OWNER_AS_APPROVER));
  const documentRevision = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, docRevId));

  // MARK: @state
  const [documentTypeGroups, setDocTypeGroups] = useState<Group[]>([]);
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [formDocument, setFormDocument] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");
  const [selectedInvalid, setSelectedInvalid] = useState<boolean>(false);
  const [checkedGroups, setCheckedGroups] = useState<Group[]>([]);

  // MARK: @config
  const history = useHistory();
  const docId = documentRevision?.document?.docId || "";
  const title = documentRevision?.name;
  const isDocumentPO = checkIsDocumentPO(documentRevision?.document?.documentType?.groupOptions);
  const intl = useIntl();
  const { isVisible, label, tooltipConfig } = useApproveAndRelease(documentTypeId);
  const classes = styles();
  const dialog = useDialog();
  const alertDialog = useDialog();
  const transformedDocTypeGroups = ([] as Group[]).concat(...documentTypeGroups);
  const initialValues = {
    password: "",
    effectiveDate: "",
    approvals: [],
    formDocument: { id: "" },
    documentType: { id: "" },
  };
  let initialGroups: Group[] = [];

  // MARK: @actions
  const releaseAction = useActionCreator(documentRevisionsActions.approveAndRelease);
  const finalizeAction = useActionCreator(documentRevisionsActions.finalizeAndRelease);
  const releaseNonQmsAction = useActionCreator(documentRevisionsActions.approveAndReleaseNonQms);
  const getDocTypeByGroupAction = useActionCreator(documentTypeActions.getDocTypeByGroup);
  const create = useActionCreator(changeRequestsActions.create);
  const getGroupsByStage = useActionCreator(documentRevisionsActions.loadGroupsByStage);


  // MARK: @async
  const async = useAsync({ onSuccess: dialog.close });
  const asyncGroups = useAsync({
    onSuccess: (response: Group[] = []) => {
      setDocTypeGroups([
        response,
      ].flat());
      if (isDocumentPO) {
        const ownerGroup = find(
          sortBy(uniqBy(response, "id"), "documentStage"),
          (group) => includes(group.joinedEmployees.map((e) => e.id), owner?.id)
        );
        if (ownerGroup) {
          initialGroups = [{
            ...ownerGroup,
            groupApprover: owner?.id,
          }];
        }
      } else {
        initialGroups = filter(
          uniqBy(response, "id"),
          (group) => includes(group.joinedEmployees.map((e) => e.id), owner?.id)
        );
      }
      setCheckedGroups(initialGroups);
    },
  });

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

  const asyncAR = useAsync<ChangeRequest>({
    onSuccess: (createdChangeRequest?) => {
      createdChangeRequest && history.push(changeRequestEditPath(createdChangeRequest.id));
    },
  });

  // MARK: @effects
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


  // MARK: @helpers
  const initialValuesAR = (values: any): any => ({
    title: intl.formatMessage({ id: "documentRevision.releasing" }, { docId, title }),
    description: intl.formatMessage({ id: "documentRevision.releasing" }, { docId, title }),
    documentType: { id: documentType },
    formDocument: {
      id: values.formDocument.value,
    },
    formInput: {
      approvers: values.approvals
        .map((approval) => approval.value)
        .concat(owner?.id).filter((id) => id)
        .map((id) => ({ id })),
      documentRevisions: [{
        descriptionOfChange: intl.formatMessage({ id: "common.numeric.release" }),
        id: FB.uniqid,
        justificationOfChange: intl.formatMessage({ id: "common.numeric.release" }),
        proposedDocumentRevision: { id: docRevId },
      }],
      effectiveDate: values.effectiveDate,
    },
  });

  const renderForm = (props: FormikProps<ApproveAndReleaseFormValues>) => (
    <ApproveAndReleaseForm
      {...props}
      asyncState={selectedInvalid ? asyncAR.asyncState : async.asyncState}
      cancel={closeDialog}
      documentTypeGroups={transformedDocTypeGroups}
      owner={owner as Owner}
      {...{
        isQms,
        templateOptions,
        setFormDocument,
        setDocumentType,
        closeDialog,
        setSelectedInvalid,
        selectedInvalid,
        isRecord,
        isInlineApproval,
        isDocumentPO,
        checkedGroups,
        setCheckedGroups,
        initialGroups,
      }}
    />
  );

  // MARK: @methods
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
    setSelectedInvalid(false);
    dialog.close();
  };

  const getApproverPayload = (approverId?: string): ApproverPayload => ({
    approver: { id: approverId || null },
    signatureGroupId: { id: find(checkedGroups, (group) => group.groupApprover === approverId)?.id || null },
  });

  const onSubmit = (values: any) => {
    if (selectedInvalid) {
      asyncAR.start(create, toChangeRequestEditRequestBody(initialValuesAR(values)), asyncAR);
      return;
    }

    /** Add owner to approvals (needed for validation) */
    const approvalsBody = concat(values.approvals || [], [{ value: owner?.id }]);

    const approversWithSignatures = !values.approvals || values.approvals.length === 0
      ? [getApproverPayload(owner?.id)]
      : approvalsBody.map((approver) => (getApproverPayload(approver.value)));
    const effectiveDate = values.effectiveDate !== ""
      ? values.effectiveDate
      : undefined;

    if (!isQms) {
      async.start(
        releaseNonQmsAction,
        id,
        {
          approversWithSignatures,
          effectiveDate,
          documentType: { id: documentType },
          formDocument: { id: formDocument },
        },
        async,
      );
      return;
    }
    if (isRecord) {
      async.start(
        finalizeAction,
        id,
        {
          effectiveDate: getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString()),
        },
        async,
      );
      return;
    }
    async.start(
      releaseAction,
      id,
      {
        approversWithSignatures,
        effectiveDate,
        documentType: { id: documentType },
        formDocument: { id: formDocument },
      },
      async,
    );
  };


  // MARK: @render
  if (!isVisible || !id || status !== DocumentRevisionStatus.Draft || !canApprove || revisionStage !== 1) {
    return null;
  }

  return (
    <>
      <CustomLabelTooltip {...{ tooltipConfig }}>
        <Button
          color="secondary"
          variant="outlined"
          onClick={isRecord ? alertDialog.open :  openDialog}
          id="ApproveAndRelease-button"
          data-cy="ApproveAndRelease-button"
        >
          <Text message={isRecord ? "record.finalize.and.release" : label} />
        </Button>
      </CustomLabelTooltip>
      {
        dialog.isOpen &&
        <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          fullWidth={true}
          maxWidth="xs"
          open={dialog.isOpen}
          onSubmit={(event: React.FormEvent) => event.stopPropagation()}
          classes={{ paper: classes.dialogContent }}
          id="ApproveAndRelease-dialog"
        >
          <DialogTitle>
            {isQms &&
              <Text translation={isRecord ? "record.finalize.and.release" : "common.approve.and.release"} />
            }
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
      <AlertDialog
        message="record.release.alert"
        dialog={alertDialog}
        confirmAction={onSubmit}
      />
    </>
  );
};

export default ApproveAndRelease;
