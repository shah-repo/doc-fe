import { Button, createStyles, Dialog, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { getHasPermission } from "../../../../common/utils/selectors";
import { Permission } from "../../../../state/ducks/auth/types";
import { documentRevisionsActions, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import ApproveAndReleaseForm from "./ApproveAndReleaseForm";

interface Props {
  id?: string;
  status?: DocumentRevisionStatus;
  isQms: boolean;
  documentName: string;
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
}) => {
  const classes = styles();
  const dialog = useDialog();
  const releaseAction = useActionCreator(documentRevisionsActions.approveAndRelease);
  const releaseNonQmsAction = useActionCreator(documentRevisionsActions.approveAndReleaseNonQms);
  const async = useAsync<any>({ onSuccess: dialog.close });
  const canApprove = useSelector(getHasPermission(Permission.CR_OWNER_AS_APPROVER));

  const openDialog = () => {
    async.reset();
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

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const renderForm = (props: FormikProps<any>) => (
    <ApproveAndReleaseForm
      {...props}
      asyncState={async.asyncState}
      cancel={closeDialog}
      isQms={isQms}
    />
  );

  return (
    <>
      <Button
        color="secondary"
        variant="outlined"
        onClick={openDialog}
      >
        <Text translation="common.approve.and.release" />
      </Button>
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
          <Formik
            initialValues={{ password: "" }}
            onSubmit={onSubmit}
          >
            {renderForm}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApproveAndRelease;
