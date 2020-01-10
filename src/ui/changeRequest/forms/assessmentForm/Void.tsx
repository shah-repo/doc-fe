import { Box, Button } from "@material-ui/core";
import React from "react";
import { ChangeRequest, changeRequestsActions } from "../../../../state/ducks/changeRequest";
import { AsyncStatus } from "../../../../state/types";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";

interface Props {
  changeRequest: ChangeRequest | undefined;
}
const AssessmentFormVoid: React.FunctionComponent<Props> = ({
  changeRequest,
}) => {
  const appyTransitionAction = useActionCreator(changeRequestsActions.applyTransition);
  const async = useAsync();
  const handleClick = () => {
    async.start(
      appyTransitionAction,
      changeRequest!.id,
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
        variant="outlined"
        color="primary"
        onClick={handleClick}
        disabled={async.asyncState.status === AsyncStatus.Active}
      >
        <Text translation="common.void" />
      </Button>
    </>
  );
};

export default AssessmentFormVoid;
