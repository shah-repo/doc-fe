/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */
import { Grid } from "@material-ui/core";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {
  getFormattedDateString,
  MomentFormats,
} from "../../../common/utils/date";
import {
  ActionTypes,
  LINE_ITEMS_STATUS_TYPES,
} from "../../../state/ducks/dashboard.new/my.feeds/types";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import Text from "../../components/Text";
import ApprovalApproved from "../line.items/approvals/approval.approved/approvalApproved";
import ApprovalClosed from "../line.items/approvals/approval.closed/approvalClosed";
import NonPOApproverActions from "../line.items/approvals/approver.actions/approverActions";
import ARApproverActions from "../line.items/approvals/approver.actions/ar.approver/approverActions";
import DirectApprovalActionItem from "../line.items/approvals/direct.request.owner.actions/default";
import DirectApprovalActionPRItem from "../line.items/approvals/direct.request.owner.actions/pending.review/pendingReview";
import PendingReview from "../line.items/approvals/pending.review/pendingReview";
import ARTaskApproval from "../line.items/approvals/task.approval/taskApproval";
import CalibrationItem from "../line.items/calibration/calibrationItem";
import DefaultLineItem from "../line.items/default/defaultLineItem";
import POApproverActions from "../line.items/purchase.order/approver.actions/approverActions";
import PurchaseOrder from "../line.items/purchase.order/default/purchaseOrder";
import PurchaseOrderPendingReview from "../line.items/purchase.order/pending.review/purchaseOrder";
import POTaskApproval from "../line.items/purchase.order/task.approval/POTaskApproval";
import NONPOTaskApproval from "../line.items/purchase.order/task.approval/taskApproval";
import TrainingItem from "../line.items/training/default/DefaultTraining";
import { styles } from "./MyFeeds.styles";

interface Props {
  loadMyFeeds: any;
  loadMyFeedsListAsyncState: AsyncState;
  // TO DO:: Needs to add type definitions
  feedItems: any[];
}

const MyFeedsLineItemPresenter: React.FunctionComponent<Props> = ({
  loadMyFeeds,
  loadMyFeedsListAsyncState,
  feedItems,
}) => {
  const classes = styles();
  const [hoverItemId, setHoverItemId] = React.useState("");
  const onMouseHoverItem = (id) => {
    setHoverItemId(id);
  };
  const onMouseLeaveItem = () => {
    setHoverItemId("");
  };

  const renderPendingActions = () => (
    <List dense className={classes.root} onMouseLeave={onMouseLeaveItem}>
      {feedItems
        .map((pendingAction, index) => {
          switch (pendingAction.type) {
            case ActionTypes.EQ_MAINTENANCE_OWNER_OR_COORDINATOR:
            case ActionTypes.EQ_CALIBRATION_OWNER_OR_COORDINATOR:
              return (
                <CalibrationItem
                  key={index}
                  id={pendingAction.id}
                  docDocumentId={pendingAction.docDocumentId}
                  type={pendingAction.type}
                  timestamp={getFormattedDateString(
                    pendingAction.timestamp,
                    MomentFormats.BriefDateTime
                  )}
                  docId={pendingAction.docId}
                  docRevId={pendingAction.docRevId}
                  docRevOwnerId={pendingAction.docRevOwnerId}
                  docRevName={pendingAction.docRevName}
                  equipmentInterval={pendingAction.equipmentInterval}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            case ActionTypes.DIRECT_PO_APPROVAL_REQ_APPROVER:
              return (
                <POTaskApproval
                  key={index}
                  id={pendingAction.id}
                  docDocumentId={pendingAction.docDocumentId}
                  approvalId={pendingAction.approvalId}
                  type={pendingAction.type}
                  timestamp={getFormattedDateString(
                    pendingAction.timestamp,
                    MomentFormats.BriefDateTime
                  )}
                  purchaseOrderSupplierDocRevId={
                    pendingAction.purchaseOrderSupplierDocRevId
                  }
                  purchaseOrderSupplierDocId={
                    pendingAction.purchaseOrderSupplierDocId
                  }
                  purchaseOrderTotalAmount={
                    pendingAction.purchaseOrderTotalAmount
                  }
                  purchaseOrderCurrency={pendingAction.purchaseOrderCurrency}
                  purchaseOrderDescription={
                    pendingAction.purchaseOrderDescription
                  }
                  purchaseOrdeLineItemCount={
                    pendingAction.purchaseOrdeLineItemCount
                  }
                  purchaseOrderAttachments={
                    pendingAction.purchaseOrderAttachments
                  }
                  purchaseSupplierName={pendingAction.purchaseSupplierName}
                  docId={pendingAction.docId}
                  docRevId={pendingAction.docRevId}
                  docRevOwnerName={pendingAction.docRevOwnerName}
                  docRevOwnerAvatar={pendingAction.docRevOwnerAvatar}
                  docRevOwnerInitialColor={pendingAction.docRevOwnerInitialColor}
                  docRevName={pendingAction.docRevName}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            case ActionTypes.DIRECT_APPROVAL_REQ_APPROVER:
              return (
                <NONPOTaskApproval
                  key={index}
                  id={pendingAction.id}
                  docDocumentId={pendingAction.docDocumentId}
                  approvalId={pendingAction.approvalId}
                  type={pendingAction.type}
                  timestamp={getFormattedDateString(
                    pendingAction.timestamp,
                    MomentFormats.BriefDateTime
                  )}
                  docId={pendingAction.docId}
                  docRevId={pendingAction.docRevId}
                  docRevOwnerName={pendingAction.docRevOwnerName}
                  docRevOwnerAvatar={pendingAction.docRevOwnerAvatar}
                  docRevOwnerInitialColor={pendingAction.docRevOwnerInitialColor}
                  docRevName={pendingAction.docRevName}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            case ActionTypes.DIRECT_PO_APPROVAL_REQ_OWNER_APPROVER_APPROVED:
              return (
                <POApproverActions
                  key={index}
                  id={pendingAction.id}
                  docDocumentId={pendingAction.docDocumentId}
                  docId={pendingAction.docId}
                  docRevId={pendingAction.docRevId}
                  type={pendingAction.type}
                  approverName={pendingAction.approverName}
                  approvalId={pendingAction.approvalId}
                  approverAvatar={pendingAction.approverAvatar}
                  approverInitialColor={pendingAction.approverInitialColor}
                  timestamp={getFormattedDateString(
                    pendingAction.timestamp,
                    MomentFormats.BriefDateTime
                  )}
                  purchaseOrderSupplierDocRevId={
                    pendingAction.purchaseOrderSupplierDocRevId
                  }
                  purchaseOrderSupplierDocId={
                    pendingAction.purchaseOrderSupplierDocId
                  }
                  status={pendingAction.approvalStatusChanged}
                  docRevName={pendingAction.docRevName}
                  purchaseOrderTotalAmount={
                    pendingAction.purchaseOrderTotalAmount
                  }
                  purchaseOrderCurrency={pendingAction.purchaseOrderCurrency}
                  purchaseOrderDescription={
                    pendingAction.purchaseOrderDescription
                  }
                  purchaseOrdeLineItemCount={
                    pendingAction.purchaseOrdeLineItemCount
                  }
                  purchaseOrderAttachments={
                    pendingAction.purchaseOrderAttachments
                  }
                  purchaseSupplierName={pendingAction.purchaseSupplierName}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            case ActionTypes.DIRECT_APPROVAL_REQ_OWNER_APPROVER_APPROVED_OR_REJECTED:
              return (
                <NonPOApproverActions
                  key={index}
                  id={pendingAction.id}
                  docDocumentId={pendingAction.docDocumentId}
                  docId={pendingAction.docId}
                  docRevId={pendingAction.docRevId}
                  type={pendingAction.type}
                  approverName={pendingAction.approverName}
                  approverAvatar={pendingAction.approverAvatar}
                  approverInitialColor={pendingAction.approverInitialColor}
                  timestamp={getFormattedDateString(
                    pendingAction.timestamp,
                    MomentFormats.BriefDateTime
                  )}
                  status={pendingAction.approvalStatusChanged}
                  docRevName={pendingAction.docRevName}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            case ActionTypes.DIRECT_PO_APPROVAL_REQ_OWNER:
              if (
                LINE_ITEMS_STATUS_TYPES.IN_REVIEW === pendingAction.docRevStatus
              ) {
                return (
                  <PurchaseOrderPendingReview
                    key={index}
                    id={pendingAction.id}
                    docDocumentId={pendingAction.docDocumentId}
                    docId={pendingAction.docId}
                    docRevId={pendingAction.docRevId}
                    type={pendingAction.type}
                    timestamp={getFormattedDateString(
                      pendingAction.timestamp,
                      MomentFormats.BriefDateTime
                    )}
                    purchaseOrderSupplierDocRevId={
                      pendingAction.purchaseOrderSupplierDocRevId
                    }
                    purchaseOrderSupplierDocId={
                      pendingAction.purchaseOrderSupplierDocId
                    }
                    status={pendingAction.docRevStatus}
                    docRevName={pendingAction.docRevName}
                    docRevPendingApprovals={
                      pendingAction.docRevPendingApprovals
                    }
                    docRevApprovedApprovals={
                      pendingAction.docRevApprovedApprovals
                    }
                    purchaseOrderTotalAmount={
                      pendingAction.purchaseOrderTotalAmount
                    }
                    purchaseOrderCurrency={pendingAction.purchaseOrderCurrency}
                    purchaseOrderDescription={
                      pendingAction.purchaseOrderDescription
                    }
                    purchaseOrdeLineItemCount={
                      pendingAction.purchaseOrdeLineItemCount
                    }
                    purchaseOrderAttachments={
                      pendingAction.purchaseOrderAttachments
                    }
                    purchaseSupplierName={pendingAction.purchaseSupplierName}
                    onMouseHoverItem={onMouseHoverItem}
                    hoverItemId={hoverItemId}
                  />
                );
              }
              return (
                <PurchaseOrder
                  key={index}
                  id={pendingAction.id}
                  docDocumentId={pendingAction.docDocumentId}
                  docId={pendingAction.docId}
                  docRevId={pendingAction.docRevId}
                  type={pendingAction.type}
                  timestamp={getFormattedDateString(
                    pendingAction.timestamp,
                    MomentFormats.BriefDateTime
                  )}
                  purchaseOrderSupplierDocRevId={
                    pendingAction.purchaseOrderSupplierDocRevId
                  }
                  purchaseOrderSupplierDocId={
                    pendingAction.purchaseOrderSupplierDocId
                  }
                  status={pendingAction.docRevStatus}
                  docRevName={pendingAction.docRevName}
                  purchaseOrderTotalAmount={
                    pendingAction.purchaseOrderTotalAmount
                  }
                  purchaseOrderCurrency={pendingAction.purchaseOrderCurrency}
                  purchaseOrderDescription={
                    pendingAction.purchaseOrderDescription
                  }
                  purchaseOrdeLineItemCount={
                    pendingAction.purchaseOrdeLineItemCount
                  }
                  purchaseOrderAttachments={
                    pendingAction.purchaseOrderAttachments
                  }
                  purchaseSupplierName={pendingAction.purchaseSupplierName}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            case ActionTypes.DIRECT_APPROVAL_REQ_OWNER:
              if (pendingAction.docRevStatus === "IN_REVIEW") {
                return (
                  <DirectApprovalActionPRItem
                    key={index}
                    id={pendingAction.id}
                    docDocumentId={pendingAction.docDocumentId}
                    docId={pendingAction.docId}
                    docRevId={pendingAction.docRevId}
                    type={pendingAction.type}
                    timestamp={getFormattedDateString(
                      pendingAction.timestamp,
                      MomentFormats.BriefDateTime
                    )}
                    status={pendingAction.docRevStatus}
                    docRevName={pendingAction.docRevName}
                    docRevPendingApprovals={
                      pendingAction.docRevPendingApprovals
                    }
                    docRevApprovedApprovals={
                      pendingAction.docRevApprovedApprovals
                    }
                    onMouseHoverItem={onMouseHoverItem}
                    hoverItemId={hoverItemId}
                  />
                );
              }
              return (
                <DirectApprovalActionItem
                  key={index}
                  id={pendingAction.id}
                  docDocumentId={pendingAction.docDocumentId}
                  docId={pendingAction.docId}
                  docRevId={pendingAction.docRevId}
                  type={pendingAction.type}
                  timestamp={getFormattedDateString(
                    pendingAction.timestamp,
                    MomentFormats.BriefDateTime
                  )}
                  status={pendingAction.docRevStatus}
                  docRevName={pendingAction.docRevName}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            case ActionTypes.TRAINING_STATUS_TRAINEE:
              return (
                <TrainingItem
                  key={index}
                  id={pendingAction.id}
                  type={pendingAction.type}
                  docRevName={pendingAction.docRevName}
                  docId={pendingAction.docId}
                  docDocumentId={pendingAction?.docDocumentId}
                  docRevId={pendingAction?.docRevId}
                  docRevVersion={pendingAction?.docRevVersion}
                  status={pendingAction.trainingStatus}
                  timestamp={getFormattedDateString(
                    pendingAction.timestamp,
                    MomentFormats.BriefDateTime
                  )}
                  dueOn={getFormattedDateString(
                    pendingAction.dueOn,
                    MomentFormats.ShortBriefDate
                  )}
                  hoverItemId={hoverItemId}
                  onMouseHoverItem={onMouseHoverItem}
                />
              );
            case ActionTypes.APPROVAL_REQ_APPROVER:
            case ActionTypes.APPROVAL_REQ_INLINE_APPROVER:
              return (
                <ARTaskApproval
                  key={index}
                  id={pendingAction.id}
                  docRevs={pendingAction.docRevs}
                  arChangeRequestId={pendingAction.arChangeRequestId}
                  type={pendingAction.type}
                  timestamp={getFormattedDateString(
                    pendingAction.timestamp,
                    MomentFormats.BriefDateTime
                  )}
                  arId={pendingAction.arId}
                  docRevOwnerName={pendingAction.onwerName}
                  docRevOwnerAvatar={pendingAction.ownerAvatar}
                  docRevOwnerInitialColor={pendingAction.ownerInitialColor}
                  title={pendingAction.arTitle}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            case ActionTypes.APPROVAL_REQ_OWNER_APPROVER_APPROVED_OR_REJECTED:
              return (
                <ARApproverActions
                  key={index}
                  id={pendingAction.id}
                  arChangeRequestId={pendingAction.arChangeRequestId}
                  type={pendingAction.type}
                  docRevs={pendingAction.docRevs}
                  arId={pendingAction.arId}
                  arTitle={pendingAction.arTitle}
                  approvalStatusChanged={pendingAction.approvalStatusChanged}
                  approverName={pendingAction.approverName}
                  approverAvatar={pendingAction.approverAvatar}
                  approverInitialColor={pendingAction.approverInitialColor}
                  timestamp={getFormattedDateString(
                    pendingAction.timestamp,
                    MomentFormats.BriefDateTime
                  )}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            case ActionTypes.APPROVED_APPROVAL_REQUESTS:
            case ActionTypes.APPROVAL_REQ_OWNER:
              if (pendingAction.arStatus === "CLOSED") {
                return (
                  <ApprovalClosed
                    key={index}
                    id={pendingAction.id}
                    arChangeRequestId={pendingAction.arChangeRequestId}
                    type={pendingAction.type}
                    arId={pendingAction.arId}
                    title={pendingAction?.arTitle}
                    docRevs={pendingAction.docRevs}
                    arStatus={pendingAction.arStatus}
                    timestamp={getFormattedDateString(
                      pendingAction.timestamp,
                      MomentFormats.BriefDateTime
                    )}
                    onMouseHoverItem={onMouseHoverItem}
                    hoverItemId={hoverItemId}
                  />
                );
              }
              if (pendingAction.arStatus === "APPROVED") {
                return (
                  <ApprovalApproved
                    key={index}
                    id={pendingAction.id}
                    arChangeRequestId={pendingAction.arChangeRequestId}
                    type={pendingAction.type}
                    arId={pendingAction.arId}
                    title={pendingAction?.arTitle}
                    docRevs={pendingAction.docRevs}
                    arStatus={pendingAction.arStatus}
                    timestamp={getFormattedDateString(
                      pendingAction.timestamp,
                      MomentFormats.BriefDateTime
                    )}
                    onMouseHoverItem={onMouseHoverItem}
                    hoverItemId={hoverItemId}
                  />
                );
              }
              if (pendingAction.arStatus === "IN_REVIEW") {
                return (
                  <PendingReview
                    key={index}
                    id={pendingAction.id}
                    type={pendingAction.type}
                    arId={pendingAction.arId}
                    title={pendingAction?.arTitle}
                    docRevs={pendingAction.docRevs}
                    arStatus={pendingAction.arStatus}
                    timestamp={getFormattedDateString(
                      pendingAction.timestamp,
                      MomentFormats.BriefDateTime
                    )}
                    pendingApprovers={pendingAction.pendingApprovers}
                    approvedApprovers={pendingAction.approvedApprovers}
                    onMouseHoverItem={onMouseHoverItem}
                    hoverItemId={hoverItemId}
                  />
                );
              }
            default:
              return (
                <DefaultLineItem
                  key={index}
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
