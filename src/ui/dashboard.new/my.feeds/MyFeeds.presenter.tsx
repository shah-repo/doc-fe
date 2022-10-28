import { Divider } from "@material-ui/core";
import List from "@material-ui/core/List";
import React from "react";
import { useSelector } from "react-redux";
import {
  getFormattedDateString,
  MomentFormats,
} from "../../../common/utils/date";
import { authSelectors } from "../../../state/ducks/auth";
import {
  ActionTypes,
  LINE_ITEMS_STATUS_TYPES,
} from "../../../state/ducks/dashboard.new/my.feeds/types";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import { DialogHandler } from "../../hooks/useDialog";
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
import { LoadMoreButton } from "../LoadMoreButton";
import NoPendingActions from "../no.pending.actions/NoPendingActions";

interface Props {
  loadMyFeeds: any;
  hoverItemId: string;
  pinLineItem: (id: string) => void;
  unPinLineItem: (pinnedItemId: string) => void;
  onMouseLeaveItem: (any) => void;
  onMouseHoverItem: (id: string) => void;
  loadMyFeedsListAsyncState: AsyncState;
  // TO DO:: Needs to add type definitions
  feedItems: any;
  overallLimit: number;
  onLoadMoreData: () => void;
  dialogPDF: DialogHandler;
}

const MyFeedsLineItemPresenter: React.FunctionComponent<Props> = ({
  loadMyFeeds,
  loadMyFeedsListAsyncState,
  feedItems,
  overallLimit,
  pinLineItem,
  unPinLineItem,
  hoverItemId,
  onMouseLeaveItem,
  onMouseHoverItem,
  onLoadMoreData,
  dialogPDF,
}) => {
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);

  const PendingActions = () => (
    <List dense onMouseLeave={onMouseLeaveItem} data-cy="dashboardFeedList">
      {feedItems.results
        .map((pendingAction, index) => {
          switch (pendingAction.type) {
            case ActionTypes.EQ_MAINTENANCE_OWNER_OR_COORDINATOR:
            case ActionTypes.EQ_CALIBRATION_OWNER_OR_COORDINATOR:
              return (
                <>
                  <CalibrationItem
                    key={index}
                    id={pendingAction.id}
                    docDocumentId={pendingAction.docDocumentId}
                    type={pendingAction.type}
                    timestamp={getFormattedDateString(
                      pendingAction.timestamp,
                      MomentFormats.BriefDateTime
                    )}
                    dueOn={getFormattedDateString(
                      pendingAction.dueOn,
                      MomentFormats.ShortBriefDate
                    )}
                    docId={pendingAction.docId}
                    docRevId={pendingAction.docRevId}
                    docRevOwnerId={pendingAction.docRevOwnerId}
                    docRevName={pendingAction.docRevName}
                    docRevVersion={pendingAction?.docRevVersion}
                    equipmentInterval={pendingAction.equipmentInterval}
                    onMouseHoverItem={onMouseHoverItem}
                    pinLineItem={pinLineItem}
                    unPinLineItem={unPinLineItem}
                    pinned={pendingAction.pinned}
                    hoverItemId={hoverItemId}
                  />
                  <Divider />
                </>
              );
            case ActionTypes.DIRECT_PO_APPROVAL_REQ_APPROVER:
              return (
                <>
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
                    docRevVersion={pendingAction?.docRevVersion}
                    onMouseHoverItem={onMouseHoverItem}
                    pinLineItem={pinLineItem}
                    unPinLineItem={unPinLineItem}
                    pinned={pendingAction.pinned}
                    hoverItemId={hoverItemId}
                    dialogPDF={dialogPDF}
                  />
                  <Divider />
                </>
              );
            case ActionTypes.APPROVAL_REQ_INLINE_APPROVER:
            case ActionTypes.DIRECT_APPROVAL_REQ_APPROVER:
              return (
                <>
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
                    docRevVersion={pendingAction?.docRevVersion}
                    onMouseHoverItem={onMouseHoverItem}
                    pinLineItem={pinLineItem}
                    unPinLineItem={unPinLineItem}
                    pinned={pendingAction.pinned}
                    hoverItemId={hoverItemId}
                  />
                  <Divider />
                </>
              );
            case ActionTypes.DIRECT_PO_APPROVAL_REQ_OWNER_APPROVER_APPROVED:
              return (
                <>
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
                    docRevVersion={pendingAction?.docRevVersion}
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
                    pinLineItem={pinLineItem}
                    unPinLineItem={unPinLineItem}
                    pinned={pendingAction.pinned}
                    hoverItemId={hoverItemId}
                    dialogPDF={dialogPDF}
                  />
                  <Divider />
                </>
              );
            case ActionTypes.DIRECT_APPROVAL_REQ_OWNER_APPROVER_APPROVED_OR_REJECTED:
              return (
                <>
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
                    docRevVersion={pendingAction?.docRevVersion}
                    onMouseHoverItem={onMouseHoverItem}
                    pinLineItem={pinLineItem}
                    unPinLineItem={unPinLineItem}
                    pinned={pendingAction.pinned}
                    hoverItemId={hoverItemId}
                  />
                  <Divider />
                </>
              );
            case ActionTypes.DIRECT_PO_APPROVAL_REQ_OWNER:
              if (
                LINE_ITEMS_STATUS_TYPES.IN_REVIEW === pendingAction.docRevStatus
              ) {
                return (
                  <>
                    <PurchaseOrderPendingReview
                      key={index}
                      id={pendingAction.id}
                      docDocumentId={pendingAction.docDocumentId}
                      docId={pendingAction.docId}
                      docRevId={pendingAction.docRevId}
                      docTypeGroup={pendingAction.docTypeGroup}
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
                      displaystatus={pendingAction.docRevDisplayStatus}
                      docRevName={pendingAction.docRevName}
                      docRevVersion={pendingAction?.docRevVersion}
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
                      pinLineItem={pinLineItem}
                      unPinLineItem={unPinLineItem}
                      pinned={pendingAction.pinned}
                      hoverItemId={hoverItemId}
                      pendingEmailSentAt={pendingAction.pendingEmailSentAt}
                      dialogPDF={dialogPDF}
                    />
                    <Divider />
                  </>
                );
              }
              return (
                <>
                  <PurchaseOrder
                    key={index}
                    id={pendingAction.id}
                    docDocumentId={pendingAction.docDocumentId}
                    docId={pendingAction.docId}
                    docRevId={pendingAction.docRevId}
                    type={pendingAction.type}
                    pinned={pendingAction.pinned}
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
                    docTypeGroup={pendingAction.docTypeGroup}
                    displaystatus={pendingAction.docRevDisplayStatus}
                    docRevName={pendingAction.docRevName}
                    docRevVersion={pendingAction?.docRevVersion}
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
                    pinLineItem={pinLineItem}
                    unPinLineItem={unPinLineItem}
                    hoverItemId={hoverItemId}
                    dialogPDF={dialogPDF}
                  />
                  <Divider />
                </>
              );
            case ActionTypes.DIRECT_APPROVAL_REQ_OWNER:
              if (pendingAction.docRevStatus === "IN_REVIEW") {
                return (
                  <>
                    <DirectApprovalActionPRItem
                      key={index}
                      id={pendingAction.id}
                      docTypeGroup={pendingAction.docTypeGroup}
                      docDocumentId={pendingAction.docDocumentId}
                      docId={pendingAction.docId}
                      docRevId={pendingAction.docRevId}
                      type={pendingAction.type}
                      timestamp={getFormattedDateString(
                        pendingAction.timestamp,
                        MomentFormats.BriefDateTime
                      )}
                      status={pendingAction.docRevStatus}
                      displaystatus={pendingAction.docRevDisplayStatus}
                      docRevName={pendingAction.docRevName}
                      docRevVersion={pendingAction?.docRevVersion}
                      docRevPendingApprovals={
                        pendingAction.docRevPendingApprovals
                      }
                      docRevApprovedApprovals={
                        pendingAction.docRevApprovedApprovals
                      }
                      onMouseHoverItem={onMouseHoverItem}
                      pinLineItem={pinLineItem}
                      unPinLineItem={unPinLineItem}
                      pinned={pendingAction.pinned}
                      hoverItemId={hoverItemId}
                      pendingEmailSentAt={pendingAction.pendingEmailSentAt}
                    />
                    <Divider />
                  </>
                );
              }
              return (
                <>
                  <DirectApprovalActionItem
                    key={index}
                    id={pendingAction.id}
                    docTypeGroup={pendingAction.docTypeGroup}
                    displaystatus={pendingAction.docRevDisplayStatus}
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
                    docRevVersion={pendingAction?.docRevVersion}
                    onMouseHoverItem={onMouseHoverItem}
                    pinLineItem={pinLineItem}
                    unPinLineItem={unPinLineItem}
                    pinned={pendingAction.pinned}
                    hoverItemId={hoverItemId}
                  />
                  <Divider />
                </>
              );
            case ActionTypes.TRAINING_STATUS_TRAINEE:
              return (
                <>
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
                    pinLineItem={pinLineItem}
                    unPinLineItem={unPinLineItem}
                    pinned={pendingAction.pinned}
                  />
                  <Divider />
                </>
              );
            case ActionTypes.APPROVAL_REQ_APPROVER:
              return (
                <>
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
                    docRevOwnerName={pendingAction.arOwnerName}
                    docRevOwnerAvatar={pendingAction.arOwnerAvatar}
                    docRevOwnerInitialColor={pendingAction.arOwnerInitialColor}
                    title={pendingAction.arTitle}
                    onMouseHoverItem={onMouseHoverItem}
                    pinLineItem={pinLineItem}
                    unPinLineItem={unPinLineItem}
                    pinned={pendingAction.pinned}
                    hoverItemId={hoverItemId}
                  />
                  <Divider />
                </>
              );
            case ActionTypes.APPROVAL_REQ_OWNER_APPROVER_APPROVED_OR_REJECTED:
              return (
                <>
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
                    pinLineItem={pinLineItem}
                    unPinLineItem={unPinLineItem}
                    pinned={pendingAction.pinned}
                    hoverItemId={hoverItemId}
                  />
                  <Divider />
                </>
              );
            case ActionTypes.APPROVED_APPROVAL_REQUESTS:
            case ActionTypes.APPROVAL_REQ_OWNER:
              if (pendingAction.arStatus === "CLOSED") {
                return (
                  <>
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
                      pinLineItem={pinLineItem}
                      unPinLineItem={unPinLineItem}
                      pinned={pendingAction.pinned}
                      hoverItemId={hoverItemId}
                    />
                    <Divider />
                  </>
                );
              }
              if (pendingAction.arStatus === "APPROVED") {
                return (
                  <>
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
                      pinLineItem={pinLineItem}
                      unPinLineItem={unPinLineItem}
                      pinned={pendingAction.pinned}
                      hoverItemId={hoverItemId}
                    />
                    <Divider />
                  </>
                );
              }
              if (pendingAction.arStatus === "IN_REVIEW") {
                return (
                  <>
                    <PendingReview
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
                      pendingApprovers={pendingAction.pendingApprovers}
                      approvedApprovers={pendingAction.approvedApprovers}
                      onMouseHoverItem={onMouseHoverItem}
                      pinLineItem={pinLineItem}
                      unPinLineItem={unPinLineItem}
                      pinned={pendingAction.pinned}
                      hoverItemId={hoverItemId}
                      pendingEmailSentAt={pendingAction.pendingEmailSentAt}
                    />
                    <Divider />
                  </>
                );
              }
              // falls through
            default:
              return (
                <>
                  <DefaultLineItem
                    key={index}
                    type={pendingAction.type}
                    status={pendingAction.arStatus || pendingAction.docRevStatus}
                    onMouseHoverItem={onMouseHoverItem}
                  />
                  <Divider />
                </>
              );
          }
        })}

      <LoadMoreButton onLoadMore={onLoadMoreData} disable={ overallLimit >= feedItems.total } id="myFeedBoxLoadMore"/>
    </List>

  );

  return (
    <AsyncGate
      asyncAction={loadMyFeeds}
      asyncState={loadMyFeedsListAsyncState}
      startActionOnMount={!!currentEmployeeId}
    >
      {feedItems.total === 0 ? <NoPendingActions /> : <PendingActions />}
    </AsyncGate>
  );
};

export default MyFeedsLineItemPresenter;
