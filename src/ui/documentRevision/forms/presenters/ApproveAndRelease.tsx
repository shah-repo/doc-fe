import { Button, createStyles, Dialog, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getHasPermission } from "../../../../common/utils/selectors";
import { Group, Permission } from "../../../../state/ducks/auth/types";
import { Owner } from "../../../../state/ducks/common/types";
import { documentRevisionsActions, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { FormContext } from "../../../components/forms/FormContext";
import Text from "../../../components/Text";
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
}) => {
  const classes = styles();
  const dialog = useDialog();
  const releaseAction = useActionCreator(documentRevisionsActions.approveAndRelease);
  const releaseNonQmsAction = useActionCreator(documentRevisionsActions.approveAndReleaseNonQms);
  const async = useAsync<any>({ onSuccess: dialog.close });
  const canApprove = useSelector(getHasPermission(Permission.CR_OWNER_AS_APPROVER));
  const [documentTypeGroups, setDocTypeGroups] = useState<any[]>([]);
  const asyncGroups = useAsync({
    onSuccess: (response: Group[] = []) => {
      setDocTypeGroups([
        response,
      ].flat());
    },
  });

  const getGroupsByStage = useActionCreator(documentRevisionsActions.loadGroupsByStage);

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
    dialog.open();
  };
  const closeDialog = () => {
    dialog.close();
  };

  const onSubmit = (values: any) => {
    const approvers = !values.approvals || values.approvals.length === 0 ?
      undefined :
      values.approvals.map((approver) => ({ id: approver.value }));
    if (!isQms) {
      async.start(
        releaseNonQmsAction,
        id,
        { approvers },
        async,
      );
      return;
    }
    async.start(
      releaseAction,
      id,
      { approvers },
      values.password,
      async,
    );
  };

  if (!id || status !== DocumentRevisionStatus.Draft || !canApprove) {
    return null;
  }

  const transformedDocTypeGroups = [].concat(...documentTypeGroups);


  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const renderForm = (props: FormikProps<ApproveAndReleaseFormValues>) => (
    <ApproveAndReleaseForm
      {...props}
      asyncState={async.asyncState}
      cancel={closeDialog}
      isQms={isQms}
      documentTypeGroups={transformedDocTypeGroups}
      owner={owner as Owner}
    />
  );

  return (
    <>
      <Button
        color="secondary"
        variant="outlined"
        onClick={openDialog}
        id="ApproveAndRelease-button"
      >
        <Text translation="common.approve.and.release" />
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
            {isQms && <Text translation="transition.action.title" />}
            {!isQms && <Text translation="common.warning.message" values={{ name: documentName }} />}
          </DialogTitle>
          <DialogContent
            classes={{ root: classes.dialogContent }}
            id="ApproveAndRelease-content"
          >
            <FormContext.Provider value={{ submitOnChange: false }}>
              <Formik
                initialValues={{ password: "", approvals: [] }}
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
