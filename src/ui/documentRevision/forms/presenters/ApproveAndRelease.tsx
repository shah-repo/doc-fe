import { Button, createStyles, Dialog, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import { documentRevisionsActions, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import { PasswordFormValues } from "../../../components/transitionDialog/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import ApproveAndReleaseForm from "./ApproveAndReleaseForm";

interface Props {
  id?: string;
  status?: DocumentRevisionStatus;
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
}) => {
  const classes = styles();
  const dialog = useDialog();
  const releaseAction = useActionCreator(documentRevisionsActions.approveAndRelease);
  const async = useAsync<any>({ onSuccess: dialog.close });

  const openDialog = () => {
    async.reset();
    dialog.open();
  };
  const closeDialog = () => {
    dialog.close();
  };

  const onSubmit = (values: PasswordFormValues) => {
    async.start(
      releaseAction,
      id,
      values,
      async,
    );
  };

  if (!id || status !== DocumentRevisionStatus.Draft) {
    return null;
  }

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const renderForm = (props: FormikProps<any>) => (
    <ApproveAndReleaseForm {...props} asyncState={async.asyncState} cancel={closeDialog} />
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
      >
        <DialogTitle>
          <Text translation="transition.action.title" />
        </DialogTitle>
        <DialogContent
          classes={{ root: classes.dialogContent }}
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
