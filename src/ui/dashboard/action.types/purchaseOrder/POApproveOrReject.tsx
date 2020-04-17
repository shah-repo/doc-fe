import { Box } from "@material-ui/core";
import React from "react";
import ChangeRequestTransitionDialogContainer from "../../../change.request/dialogs/ChangeRequestTransitionDialog.container";

interface Props {
  changeRequestId: string;
}

export const POApproveOrReject: React.FunctionComponent<Props> = ({
  changeRequestId,
}) => (
  <Box>
    <ChangeRequestTransitionDialogContainer
      transition="reject"
      changeRequestId={changeRequestId}
      buttonProps={{
        color: "secondary",
        variant: "outlined",
      }}
      label="common.reject"
    />
    <ChangeRequestTransitionDialogContainer
      transition="approve"
      changeRequestId={changeRequestId}
      buttonProps={{
        color: "secondary",
      }}
      label="common.approve"
    />
  </Box>

);

export default POApproveOrReject;
