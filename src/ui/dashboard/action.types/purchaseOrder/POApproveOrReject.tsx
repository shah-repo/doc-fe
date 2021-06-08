import { Box, Button, Grid } from "@material-ui/core";
import React from "react";
import { approvalsActions } from "../../../../state/ducks/approvals";
import { toastError } from "../../../components/notifications";
import Text from "../../../components/Text";
import { FBInlineApprovalTransition } from "../../../form.builder";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { DocumentRevisionApprovalDialog } from "../DocumentRevisionApprovalDialog";

interface Props {
  approvalId: string;
}

const POApproveOrReject: React.FunctionComponent<Props> = ({
  approvalId,
}) => {
  const passwordDialog = useDialog();

  const applyTransition = useActionCreator(approvalsActions.applyTransition);
  const async = useAsync({
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error) => {
      toastError(error as string);
    },
  });

  const changeApprovalStatus = (transition: FBInlineApprovalTransition, approvalId?: string, password?: string) => {
    async.start(
      applyTransition,
      approvalId,
      transition,
      async,
      password,
    );
  };

  return (
    <>
      <Box>
        <Grid item>
          <Button
            variant="outlined"
            color="secondary"
            aria-label="reject"
            data-cy="transition-reject"
            onClick={() => changeApprovalStatus("reject", approvalId)}
          >
            <Text translation="transition.action.reject"/>
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            aria-label="approve"
            data-cy="transition-approve"
            onClick={() => passwordDialog.open()}
          >
            <Text translation="transition.action.approve"/>
          </Button>
        </Grid>
      </Box>
      <DocumentRevisionApprovalDialog
        asyncState={async.asyncState}
        approvalId={approvalId}
        {...{ changeApprovalStatus, passwordDialog }}
      />
    </>
  );
};

export default POApproveOrReject;
