import { Button } from "@material-ui/core";
import React from "react";
import { documentRevisionsActions, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import PasswordDialog from "../../../components/password/dialog";
import Text from "../../../components/Text";
import { PasswordFormValues } from "../../../components/transitionDialog/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";

interface Props {
  id?: string;
  status?: DocumentRevisionStatus;
}

export const ApproveAndRelease: React.FunctionComponent<Props> = ({
  id,
  status,
}) => {
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

  return (
    <>
      <Button
        color="secondary"
        variant="outlined"
        onClick={openDialog}
      >
        <Text translation="common.approve.and.release" />
      </Button>
      <PasswordDialog
        asyncState={async.asyncState}
        closeDialog={closeDialog}
        isDialogOpen={dialog.isOpen}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default ApproveAndRelease;
