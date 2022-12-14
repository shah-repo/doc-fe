/* eslint-disable no-console */
import { Button, createStyles, Dialog, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import { concat, filter, find, flatten, includes, sortBy, uniqBy } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { StyledMenuListItem } from "../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import SM from "../../../../../App/Shifamed/Utils/SM/SM";
import { getStartOfDayDateString, TIME_ZONE } from "../../../../../common/utils/date";
import { getHasPermission } from "../../../../../common/utils/selectors";
import { Group, Permission } from "../../../../../state/ducks/auth/types";
import { changeRequestsActions } from "../../../../../state/ducks/changeRequest";
import { ChangeRequest } from "../../../../../state/ducks/changeRequest/types";
import { Owner } from "../../../../../state/ducks/common/types";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../../../state/ducks/documentRevisions";
import { documentTypeActions } from "../../../../../state/ducks/documentRevisions/documentType";
import { DocumentTypeById } from "../../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../../state/reducers";
import AlertDialog from "../../../../app/alert.dialog/AlertDialog";
import ChangeRequestEditDialog from "../../../../change.request/dialogs/ChangeRequestEditDialog";
import FormListContent from "../../../../change.request/form.list/dialog/FormListContent";
import FormListHeader from "../../../../change.request/form.list/dialog/FormListHeader";
import { templateOptionToChangeRequestCreateBody, toChangeRequestEditRequestBody } from "../../../../change.request/form/transform";
import { ApproverPayload, ExistingInDraftCOOption, TemplateOption } from "../../../../change.request/form/types";
import { newARDocRevToAdd } from "../../../../change.request/items.and.details/helpers";
import { changeRequestEditPath } from "../../../../change.request/utils/paths";
import { FormContext } from "../../../../components/forms/FormContext";
import { toastError } from "../../../../components/notifications";
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
import SplitReleaseButton, { ARActions } from "./SplitReleaseButton";

interface Props {
  id?: string;
  status?: DocumentRevisionStatus;
  isQms: boolean;
  needsSignature: boolean;
  documentName: string;
  docRevId: string;
  owner?: Owner;
  documentTypeId?: string;
  revisionStage?: number;
  isRecord: boolean;
  isInlineApproval: boolean;
  renderAsButton?: boolean;
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
  needsSignature,
  documentName,
  docRevId,
  owner,
  documentTypeId,
  revisionStage,
  isRecord,
  isInlineApproval,
  renderAsButton,
}) => {

  // MARK: @selectors
  const canApprove = useSelector(getHasPermission(Permission.CR_OWNER_AS_APPROVER));
  const documentRevision = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, docRevId));

  // MARK: @state
  const [documentTypeGroups, setDocTypeGroups] = useState<Group[]>([]);
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [existingInDraftCOOptions, setExistingInDraftCOOptions] = useState<ExistingInDraftCOOption[]>([]);
  const [formDocument, setFormDocument] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");
  const [selectedInvalid, setSelectedInvalid] = useState<boolean>(false);
  const [checkedGroups, setCheckedGroups] = useState<Group[]>([]);
  const [changeRequestId, setChangeRequestId] = useState<string>("");

  // MARK: @config
  const isNewLayout = SM.isNewLayout;
  const history = useHistory();
  const docId = documentRevision?.document?.docId || "";
  const title = documentRevision?.name;
  const isDocumentPO = checkIsDocumentPO(documentRevision?.document?.documentType?.groupOptions);
  const intl = useIntl();
  const { isVisible, label, tooltipConfig } = useApproveAndRelease(documentTypeId);
  const classes = styles();

  const expressApprovalDialog = useDialog();
  const templateSelectionDialog = useDialog();
  const existingDraftCOSelectionDialog = useDialog();
  const changeOrderDialog = useDialog();

  const alertDialog = useDialog();

  const dispatch = useDispatch();

  const transformedDocTypeGroups = ([] as Group[]).concat(...documentTypeGroups);
  const initialValues = {
    password: "",
    effectiveDate: "",
    approvals: [],
    formDocument: { id: "" },
    documentType: { id: "" },
  };
  let initialGroups: Group[] = [];
  const showApprovers = !isQms ? needsSignature : isQms;

  // MARK: @actions
  const releaseAction = useActionCreator(documentRevisionsActions.approveAndRelease);
  const finalizeAction = useActionCreator(documentRevisionsActions.finalizeAndRelease);
  const releaseNonQmsAction = useActionCreator(documentRevisionsActions.approveAndReleaseNonQms);
  const create = useActionCreator(changeRequestsActions.create);
  const getGroupsByStage = useActionCreator(documentRevisionsActions.loadGroupsByStage);


  // MARK: @async
  const async = useAsync({ onSuccess: expressApprovalDialog.close });
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

  // Templates Call
  const getDocTypeByGroupAction = useActionCreator(documentTypeActions.getDocTypeByGroup);
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
      if (templateOptions.length > 0) {
        if (templateOptions.length === 1) {
          processCreatingRevision(templateOptions[0]);
        } else {
          templateSelectionDialog.open();
        }
      }
    },
  });

  // Existing Draft CO calls
  const getDraftChangeOrdersAction = useActionCreator(changeRequestsActions.draftChangeOrdersList);
  const asyncGetDraftChangeOrders = useAsync({
    onSuccess: (data: Pick<ChangeRequest, "crId" | "title" | "id">[] = []) => {
      const options = data.map((option) => ({
        label: `${option.crId} - ${option.title}`,
        value: option.id,
        crId: option.crId,
      }));
      if (options.length === 0) {
        toastError("No Change Orders in Draft");
        return;
      }

      setExistingInDraftCOOptions(options);
    },
  });

  const createCRAction = useActionCreator(changeRequestsActions.create);
  const createCRAsync = useAsync<ChangeRequest>({
    onSuccess: (createdChangeRequest?) => {
      if (createdChangeRequest) {
        setChangeRequestId(createdChangeRequest.id);

        templateSelectionDialog.close();
        changeOrderDialog.open();
      }
    },
    onError: (err) => {
      toastError(err as string);
    },
  });

  useEffect(() => {
    if (templateOptions.length > 0) {
      if (templateOptions.length === 1) {
        processCreatingRevision(templateOptions[0]);
      } else {
        templateSelectionDialog.open();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateOptions]);


  useEffect(() => {
    if (existingInDraftCOOptions.length > 0) {
      if (existingInDraftCOOptions.length === 1) {
        processChosenChangeOrder(existingInDraftCOOptions[0]);
      } else {
        existingDraftCOSelectionDialog.open();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingInDraftCOOptions]);


  const processCreatingRevision = (templateChosen) => {
    if (!templateChosen) {
      return;
    }
    const data = templateOptionToChangeRequestCreateBody(templateChosen);
    // By default when creating a new CO, the current document revision should be auto linked
    data.formInput = {
      documentRevisions: [newARDocRevToAdd(docRevId)],
    };
    createCRAsync.start(createCRAction, data, createCRAsync);
  };

  const processChosenChangeOrder = (changeOrderChosen: ExistingInDraftCOOption) => {
    if (!changeOrderChosen) {
      return;
    }

    setChangeRequestId(changeOrderChosen.value);

    existingDraftCOSelectionDialog.close();
    changeOrderDialog.open();
  };

  const asyncAR = useAsync<ChangeRequest>({
    onSuccess: (createdChangeRequest?) => {
      createdChangeRequest && history.push(changeRequestEditPath(createdChangeRequest.id));
    },
  });

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
      password: values.password,
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
        needsSignature,
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
      asyncGetDocTypeState={asyncGetDocTypeByGroup.asyncState}
    />
  );

  // MARK: @methods
  const openDialog = (option?: any) => {
    async.reset();

    if (!option && showApprovers && docRevId) {
      asyncGroups.start(
        getGroupsByStage,
        docRevId,
        asyncGroups,
      );
      expressApprovalDialog.open();
    }

    if (option === ARActions.NEW) {
      asyncGetDocTypeByGroup.start(
        getDocTypeByGroupAction,
        { docTypeGroupOption: "CHANGE_REQUEST" },
        asyncGetDocTypeByGroup);
    }

    if (option === ARActions.EXISTING) {
      asyncGetDraftChangeOrders.start(
        getDraftChangeOrdersAction,
        asyncGetDraftChangeOrders);
    }
  };

  const closeDialog = () => {
    setFormDocument("");
    setDocumentType("");
    setSelectedInvalid(false);
    expressApprovalDialog.close();
  };

  const closeCRDialog = () => {
    changeOrderDialog.close();
    dispatch(documentRevisionsActions.reload(docRevId));
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
    const password = values.password !== ""
      ? values.password
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
        password,
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
      password,
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
        {isNewLayout ? (
          renderAsButton ?
            <SplitReleaseButton
              onClick = {isRecord ? alertDialog.open : openDialog} />
            :
            <StyledMenuListItem button alignItems="flex-start">
              <StyledMenuListItemText
                id="ApproveAndRelease-button"
                data-cy="ApproveAndRelease-button"
                primary={ <Text message={isRecord ? "record.finalize.and.release" : label} />}
                onClick={isRecord ? alertDialog.open : openDialog}
              />
            </StyledMenuListItem>
        ) : (
          <Button
            color="secondary"
            variant="outlined"
            onClick={isRecord ? alertDialog.open : openDialog}
            id="ApproveAndRelease-button"
            data-cy="ApproveAndRelease-button"
          >
            <Text message={isRecord ? "record.finalize.and.release" : label} />
          </Button>
        )}
      </CustomLabelTooltip>
      {
        templateSelectionDialog.isOpen &&
        <Dialog
          open={templateSelectionDialog.isOpen}
          onClose={templateSelectionDialog.close}
          classes={{ paper: classes.dialogPaper }}
        >
          <FormListHeader {...{ dialog: templateSelectionDialog }} />
          <FormListContent {...{
            dialog: templateSelectionDialog,
            templateOptions,
            handleTemplateSelection: processCreatingRevision,
          }} />
        </Dialog>
      }
      {
        existingDraftCOSelectionDialog.isOpen &&
        <Dialog
          open={existingDraftCOSelectionDialog.isOpen}
          onClose={existingDraftCOSelectionDialog.close}
          classes={{ paper: classes.dialogPaper }}
        >
          <FormListHeader {...{
            dialog: existingDraftCOSelectionDialog,
            subtitle1Translation: "change.request.select.existing.title",
            subtitle2Translation: "change.request.select.existing.content",
          }} />
          <FormListContent {...{
            dialog: existingDraftCOSelectionDialog,
            existingInDraftCOOptions,
            labelTranslation: "change.request.select.existing.title",
            handleExistingCOSelection: processChosenChangeOrder,
          }} />
        </Dialog>
      }
      {
        expressApprovalDialog.isOpen &&
        <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          fullWidth={true}
          maxWidth="xs"
          open={expressApprovalDialog.isOpen}
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
      {
        changeOrderDialog.isOpen &&
        <ChangeRequestEditDialog
          changeRequestId={changeRequestId}
          changeOrderDialog={changeOrderDialog}
          closeDialog = {closeCRDialog}
          currentDocRevId = {docRevId}
        />
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
