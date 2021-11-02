/* eslint-disable react/react-in-jsx-scope */
import { Grid } from "@material-ui/core";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { ActionTypes } from "../../../state/ducks/dashboard.new/my.feeds/types";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import Text from "../../components/Text";
import ApprovalApproved from "../line.items/approvals/approval.approved/approvalApproved";
import ApprovalClosed from "../line.items/approvals/approval.closed/approvalClosed";
import PendingReview from "../line.items/approvals/pending.review/pendingReview";
import TaskApproval from "../line.items/approvals/task.approval/taskApproval";
import DefaultLineItem from "../line.items/default/defaultLineItem";
import { styles } from "./MyFeeds.styles";

interface Props {
  loadMyFeeds: any;
  loadMyFeedsListAsyncState: AsyncState;
  // feedItems: RecentItems[];
  feedItems: any[];
}
// interface Props {
//   feedItems: {
//     id: string;
//     type: string;
//     timestamp?: string | undefined;
//     arTitle?: string | undefined;
//     arStatus?: string | undefined;
//     arId?: string | undefined;
//     pendingApprovers?: any[] | undefined;
//     docRevs?: any;
//     docId?: string | undefined;
//     docRevName?: string | undefined;
//     docRevStatus?: string | undefined;
//     docRevOwnerName?: string | undefined;
//     docRevOwnerAvatar?: string | undefined | null;
//     docRevOwnerId?: string | undefined;
//     docRevPendingApprovals?: any;
//     docRevApprovedApprovals?: any;
//   }[];
// }
const MyFeedsLineItemPresenter: React.FunctionComponent<Props> = ({
  loadMyFeeds, loadMyFeedsListAsyncState, feedItems,
}) => {
  const classes = styles();
  const [hoverItemId, setHoverItemId] = React.useState("");
  const onMouseHoverItem = (arId) => {
    setHoverItemId(arId);
  };
  const onMouseLeaveItem = () => {
    setHoverItemId("");
  };
  const renderPendingActions = () => (
    <List dense className={classes.root} onMouseLeave={onMouseLeaveItem}>
      {feedItems.map((pendingAction, index) => {
        switch (pendingAction.type) {
          case ActionTypes.PENDING_DOC_CONTROL:
          case ActionTypes.APPROVAL_REQ_APPROVER:
          case ActionTypes.APPROVAL_REQ_INLINE_APPROVER:
          case ActionTypes.DIRECT_APPROVAL_REQ_OWNER:
          case ActionTypes.DIRECT_APPROVAL_REQ_APPROVER:
            return (
              pendingAction?.docRevStatus &&
              !["DRAFT", "WIP"].includes(pendingAction.docRevStatus) && (
                <TaskApproval
                  id={pendingAction.id}
                  type={pendingAction.type}
                  timestamp={pendingAction.timestamp}
                  arId={pendingAction.docId}
                  docRevId={pendingAction.docRevId}
                  docRevOwnerName={pendingAction.docRevOwnerName}
                  docRevOwnerAvatar={pendingAction.docRevOwnerAvatar}
                  title={pendingAction.docRevName}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              )
            );
          case ActionTypes.APPROVED_APPROVAL_REQUESTS:
          case ActionTypes.APPROVAL_REQ_OWNER:
            if (pendingAction.arStatus === "CLOSED") {
              return (
                <ApprovalClosed
                  id={pendingAction.id}
                  type={pendingAction.type}
                  arId={pendingAction.arId}
                  title={pendingAction?.arTitle}
                  docRevs={pendingAction.docRevs}
                  arStatus={pendingAction.arStatus}
                  timestamp={pendingAction.timestamp}
                  pendingApprovers={pendingAction.pendingApprovers}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            }
            if (pendingAction.arStatus === "APPROVED") {
              return (
                <ApprovalApproved
                  id={pendingAction.id}
                  type={pendingAction.type}
                  arId={pendingAction.arId}
                  title={pendingAction?.arTitle}
                  docRevs={pendingAction.docRevs}
                  arStatus={pendingAction.arStatus}
                  timestamp={pendingAction.timestamp}
                  pendingApprovers={pendingAction.pendingApprovers}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            }
            if (pendingAction.arStatus === "IN_REVIEW") {
              return (
                <PendingReview
                  id={pendingAction.id}
                  type={pendingAction.type}
                  arId={pendingAction.arId}
                  title={pendingAction?.arTitle}
                  docRevs={pendingAction.docRevs}
                  arStatus={pendingAction.arStatus}
                  timestamp={pendingAction.timestamp}
                  pendingApprovers={pendingAction.pendingApprovers}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            }
          default:
            return (
              <DefaultLineItem
                type={pendingAction.type}
                status={pendingAction.arStatus || pendingAction.docRevStatus}
                onMouseHoverItem={onMouseHoverItem}
              />
            );
        }
      })}
    </List>
  );
  const renderNoPendingActions = feedItems.length === 0 && (
    <Typography className={classes.noPendingActions}>
      <Text
        translation="dashboard.noPendingActions"
        dataCy="dashboard.noPendingActions"
      />
    </Typography>
  );

  return (
    <Grid container={true} spacing={5} className={classes.grid}>
      <Grid item={true} md={12} sm={12}>
        <AsyncGate
          asyncAction={loadMyFeeds}
          asyncState={loadMyFeedsListAsyncState}
          startActionOnMount={true}
        >
          {feedItems.length > 0 && renderPendingActions()}
          {renderNoPendingActions}
        </AsyncGate>
      </Grid>
    </Grid>
  );
};

export default MyFeedsLineItemPresenter;
