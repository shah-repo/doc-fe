import { Box } from "@material-ui/core";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { dashboardActions } from "../../../../state/ducks/dashboard";
import ChangeRequestTransitionDialogContainer from "../../../change.request/dialogs/ChangeRequestTransitionDialog.container";
import { IndexContetxt } from "./PurchaseOrderApproval";

interface Props {
  changeRequestId: string;
}

const POApproveOrReject: React.FunctionComponent<Props> = ({
  changeRequestId,
}) => {
  const index = useContext(IndexContetxt);
  const dispatch = useDispatch();
  const removeDashboardItem = () => {
    setTimeout(() => dispatch(dashboardActions.removeFromList(index)), 500);
  };

  return (
    <Box>
      <ChangeRequestTransitionDialogContainer
        transition="reject"
        changeRequestId={changeRequestId}
        buttonProps={{
          color: "secondary",
          variant: "outlined",
        }}
        label="common.reject"
        onSuccess={removeDashboardItem}
      />
      <ChangeRequestTransitionDialogContainer
        transition="approve"
        changeRequestId={changeRequestId}
        buttonProps={{
          color: "secondary",
        }}
        label="common.approve"
        onSuccess={removeDashboardItem}
      />
    </Box>
  );
};

export default POApproveOrReject;
