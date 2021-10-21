/* eslint-disable react/react-in-jsx-scope */
import { Grid } from "@material-ui/core";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { ActionTypes } from "../../../state/ducks/dashboard/types";
import Text from "../../components/Text";
import ApprovalApproved from "../line.items/approvals/approval.approved/approvalApproved";
import ApprovalReject from "../line.items/approvals/approval.reject/approvalReject";
import ApprovalRelease from "../line.items/approvals/approval.release/approvalRelease";
import PendingReview from "../line.items/approvals/pending.review/pendingReview";
import TaskApproval from "../line.items/approvals/task.approval/taskApproval";
import PurchaseOrder from "../line.items/purchase.order/purchaseOrder";
import NewTraining from "../line.items/training/new.training/newTraining";
import PendingTraining from "../line.items/training/pending.training/pendingTraining";
import { styles } from "./MyFeeds.styles";

interface Props {
  feedItems: {
    id: string;
    type: string;
    title: string;
    documentId: string;
    status: string;
    timestamp: string;
    verbose: string;
    dueDate?: any;
    requestedBy?: any;
    approvers: string[];
  }[];
}
const MyFeedsLineItemPresenter: React.FunctionComponent<Props> = ({
  feedItems,
}) => {
  const classes = styles();
  const renderPendingActions = () => (
    <List dense className={classes.root}>
      {
        feedItems.map((pendingAction, index) => {
          switch (pendingAction.type) {
            case ActionTypes.PENDING_REVIEW:
              return <PendingReview  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                verbose={pendingAction.verbose}
                approvers ={pendingAction.approvers}/>;
            case ActionTypes.NEW_TRAINING_RECORDS:
              return <NewTraining  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                verbose={pendingAction.verbose}
                dueDate ={pendingAction.dueDate}
                approvers ={pendingAction.approvers}/>;
            case ActionTypes.PENDING_TRAINING_RECORDS:
              return <PendingTraining  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                verbose={pendingAction.verbose}
                dueDate ={pendingAction.dueDate}/>;
            case ActionTypes.PURCHASE_ORDERS:
              return <PurchaseOrder  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                verbose={pendingAction.verbose}
                approvers ={pendingAction.approvers}/>;
            case ActionTypes.PENDING_DOC_CONTROL:
            case ActionTypes.PENDING_TASK:
              return <TaskApproval  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                verbose={pendingAction.verbose}
                requestedBy={pendingAction.requestedBy}
                approvers ={pendingAction.approvers}/>;
            case ActionTypes.APPROVED_APPROVAL_REQUESTS:
              return <ApprovalApproved  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                verbose={pendingAction.verbose}
                approvers ={pendingAction.approvers}/>;
            case ActionTypes.RELEASE_APPROVAL_REQUESTS:
              return <ApprovalRelease  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                verbose={pendingAction.verbose}
                approvers ={pendingAction.approvers}/>;
            case ActionTypes.REJECT_APPROVAL_REQUESTS:
              return <ApprovalReject  id={pendingAction.id} type={pendingAction.type}
                title ={pendingAction.title} documentId={pendingAction.documentId}
                status={pendingAction.status} timestamp={pendingAction.timestamp}
                verbose={pendingAction.verbose}
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

    <Grid container={true} spacing={5}>
      <Grid item={true} md={12} sm={12}>
        {feedItems.length > 0 && renderPendingActions()}
        {renderNoPendingActions}
      </Grid>
    </Grid>

  );
};

export default MyFeedsLineItemPresenter;
