import { Box, Button } from "@material-ui/core";
import React from "react";
import { changeRequestsActions } from "../../../../state/ducks/changeRequest";
import { ChangeRequest } from "../../../../state/ducks/changeRequest/types";
import { AsyncStatus } from "../../../../state/types";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";

interface Props {
  changeRequest: ChangeRequest | undefined;
}
const AssessmentFormVoidContainer: React.FunctionComponent<Props> = ({
  changeRequest,
}) => {
  const dialog = useDialog();
  const appyTransitionAction = useActionCreator(changeRequestsActions.applyTransition);
  const async = useAsync();
  const voidDocument = () => {
    changeRequest
    && async.start(
      appyTransitionAction,
      changeRequest.id,
      { password: "" },
      "void",
      async,
    );
  };

  if (!changeRequest) {
    return null;
  }

  return (
    <>
      <Box position="absolute" marginTop="-50px">
        <FormMessage asyncState={async.asyncState} />
        <FormProgress asyncState={async.asyncState} />
      </Box>
      <Button
        id="void"
        variant="outlined"
        color="secondary"
        onClick={dialog.open}
        disabled={async.asyncState.status === AsyncStatus.Active}
      >
        <Text translation="common.void" />
      </Button>
      <AlertDialog
        confirmAction={voidDocument}
        message={"change.request.void.alert"}
        {...{ dialog }}
      />
    </>
  );
};

export default AssessmentFormVoidContainer;
