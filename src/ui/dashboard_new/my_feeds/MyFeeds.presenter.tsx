/* eslint-disable react/react-in-jsx-scope */
import { Grid } from "@material-ui/core";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { PendingActionType } from "../../../state/ducks/dashboard/types";
import Text from "../../components/Text";
import ApprovalClose from "../line_items/approvals/approval_close/approvalClose";
import PendingReview from "../line_items/approvals/pending_review/pendingReview";
import TaskApproval from "../line_items/approvals/task_approval/taskApproval";
import PurchaseOrder from "../line_items/purchase_order/purchaseOrder";
import PendingTraining from "../line_items/training/pending_training/pendingTraining";
import { styles } from "./MyFeeds.styles";

interface Props {
  feedItems: any;
}
const MyFeedsPresenter: React.FunctionComponent<Props> = ({
  feedItems,
}) => {
  const classes = styles();
  const renderPendingActions = () => (
    <List>
      {
        feedItems.map((pendingAction, index) => {
          switch (pendingAction.type) {
            case PendingActionType.PENDING_REVIEW:
              return <PendingReview  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                approvers ={pendingAction.approvers}/>;
            case PendingActionType.PENDING_TRAINING_RECORDS:
              return <PendingTraining  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                approvers ={pendingAction.approvers}/>;
            case PendingActionType.PURCHASE_ORDERS:
              return <PurchaseOrder  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                approvers ={pendingAction.approvers}/>;
            case PendingActionType.PENDING_DOC_CONTROL:
            case PendingActionType.PENDING_TASK:
              return <TaskApproval  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                approvers ={pendingAction.approvers}/>;
            case PendingActionType.APPROVED_APPROVAL_REQUESTS:
              return <ApprovalClose  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                approvers ={pendingAction.approvers}/>;

            default:
              return <Text key={index} translation="common.undefined" />;
          }
        })
      }
    </List>
  );
  const renderNoPendingActions = feedItems.length === 0 && (
    <Typography className={classes.noPendingActions}>
      <Text translation="dashboard.noPendingActions" dataCy="dashboard.noPendingActions"/>
    </Typography>
  );

  return (
    <Grid container={true} className={classes.root} spacing={4}>
      <Grid item={true} className={classes.item}>
        {feedItems.length > 0 && renderPendingActions()}
        {renderNoPendingActions}
      </Grid>
    </Grid>
  );
};

export default MyFeedsPresenter;
