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
        .concat([
          {
            type: "NON PO START",
            status: "NON PO START",
          },
          {
            approvalStatusChanged: "UNDEFINED",
            docId: "TC-00482",
            docDocumentId: "6c86ccca-ff03-48f4-80d4-1c184af35c1b",
            docRevName: "DIRECT APPROVED/RELEASED",
            docRevId: "167da1ef-b28d-46e5-bccb-7e138708a205",
            docRevStatus: "RELEASED",
            docRevOwnerName: "Veronica  B",
            docRevOwnerAvatar: null,
            docRevOwnerInitialColor: "#81d9ea",
            docRevOwnerId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
            docRevPendingApprovals: [],
            docRevApprovedApprovals: [
              {
                userName: "Veronica  B",
                employeeId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
                userAvatar: null,
                userInitialColor: "#81d9ea",
                approvalStatus: "APPROVED",
              },
            ],
            id: "f83052iop-edec-4f0e-aba6-6336950948f6",
            timestamp: "2021-11-02T04:54:01.132Z",
            type: "DIRECT_APPROVAL_REQ_OWNER",
          },
          {
            approvalStatusChanged: "UNDEFINED",
            docId: "PO-00482",
            docDocumentId: "6c86ccca-ff03-48f4-80d4-1c184af35c1b",
            docRevName: "SPRING TEST DOC",
            docRevId: "167da1ef-b28d-46e5-bccb-7e138708a205",
            docRevStatus: "IN_REVIEW",
            docRevOwnerName: "Veronica  B",
            docRevOwnerAvatar: null,
            docRevOwnerInitialColor: "#81d9ea",
            docRevOwnerId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
            docRevPendingApprovals: [
              {
                userName: "Maja Main acc",
                employeeId: "15b6aac9-9ad0-4d6f-8195-5f73d6e2bf33",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2F0c25dc24-3417-4414-a86a-435c2155cfe9%2F2021-11-08T14%253A08%253A09.401Z%2Fyellow.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075535891%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=dmcbgb2QuOFIVNBl3woYwgEgs6p6XfxKIuWHQZnXtX8%3D&amp;reserved=0",
                userInitialColor: "#f904e9",
                approvalStatus: "PENDING",
              },
            ],
            docRevApprovedApprovals: [
              {
                userName: "Veronica  B",
                employeeId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
                userAvatar: null,
                userInitialColor: "#81d9ea",
                approvalStatus: "APPROVED",
              },
            ],
            id: "f83052a0-edec-4f0e-aba6-6336950948f6",
            timestamp: "2021-11-02T04:54:01.132Z",
            type: "DIRECT_APPROVAL_REQ_OWNER",
          },
          {
            approvalStatusChanged: "APPROVED",
            approvalId: "786deaad-155d-4960-b9df-99bd479affff",
            approverAvatar: null,
            approverName: "Suresh",
            approverInitialColor: "#3c469b",
            docId: "TDC-00153",
            docDocumentId: "33de63fd-d0f2-4dd8-8858-92498a750ee3",
            docRevName: "APPROVED DOC TEST",
            docRevId: "7234e0f2-5fd0-41f3-9127-0b4c30588b96",
            docRevStatus: "RELEASED",
            docRevOwnerName: "Mirela",
            docRevOwnerAvatar: null,
            docRevOwnerInitialColor: "#3c469b",
            docRevOwnerId: "062491dc-6a63-4038-a9bf-b8b625308870",
            docRevPendingApprovals: [],
            docRevApprovedApprovals: [
              {
                userName: "Mirela",
                employeeId: "062491dc-6a63-4038-a9bf-b8b625308870",
                userAvatar: null,
                userInitialColor: "#3c469b",
                approvalStatus: "APPROVED",
              },
            ],
            id: "005cd8d61-5f5c-4467-a00f-5b1fab57debc",
            timestamp: "2021-11-08T16:39:52.619Z",
            type: "DIRECT_APPROVAL_REQ_OWNER_APPROVER_APPROVED_OR_REJECTED",
          },
          {
            purchaseOrderSupplierDocRevId:
              "d177ff4c-5b66-4eaf-a953-b109e69e72bd",
            purchaseOrderSupplierDocId: "76e1e83c-2489-40dd-9acd-dfe9bada81db",
            purchaseSupplierName: "CC Enterprise",
            approvalStatusChanged: "UNDEFINED",
            approvalId: "18ed38cc-7d72-4e41-b04d-b7c960ceae14",
            approverName: "",
            approverAvatar: null,
            approverInitialColor: "#81d9ea",
            docId: "PO-00482",
            docDocumentId: "6c86ccca-ff03-48f4-80d4-1c184af35c1b",
            docRevName: "DIRECT REQ",
            docRevId: "167da1ef-b28d-46e5-bccb-7e138708a205",
            docRevStatus: "IN_REVIEW",
            docRevOwnerName: "Veronica  B",
            docRevOwnerAvatar: null,
            docRevOwnerInitialColor: "#81d9ea",
            docRevOwnerId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
            docRevPendingApprovals: [
              {
                userName: "Maja Main acc",
                employeeId: "15b6aac9-9ad0-4d6f-8195-5f73d6e2bf33",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2F0c25dc24-3417-4414-a86a-435c2155cfe9%2F2021-11-08T14%253A08%253A09.401Z%2Fyellow.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075535891%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=dmcbgb2QuOFIVNBl3woYwgEgs6p6XfxKIuWHQZnXtX8%3D&amp;reserved=0",
                userInitialColor: "#f904e9",
                approvalStatus: "PENDING",
              },
              {
                userName: "Julia Makarenko",
                employeeId: "222f9557-1dad-4953-a83f-893c811932fe",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2Fe2c3799b-a476-486d-b527-388b80006171%2F2020-07-19T09%253A58%253A50.126Z%2F0d.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075545886%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=SqGLfl2XZf5CG3iwZ4obyvrxr5vTeRQQWbYb%2B5%2FaEnI%3D&amp;reserved=0",
                userInitialColor: "#95f957",
                approvalStatus: "PENDING",
              },
              {
                userName: "Zoran Kovacevic",
                employeeId: "c15664b7-229e-45df-bdb3-8b37db294f6b",
                userAvatar: null,
                userInitialColor: "#ea746e",
                approvalStatus: "PENDING",
              },
              {
                userName: "Test1",
                employeeId: "e1e76f2f-cb14-4940-86c2-09aa45185236",
                userAvatar: null,
                userInitialColor: "#f3f99f",
                approvalStatus: "PENDING",
              },
              {
                userName: "Veronica +1",
                employeeId: "a51dfeed-6ee0-444e-8f97-26f8642c4c8e",
                userAvatar: null,
                userInitialColor: "#56d10a",
                approvalStatus: "PENDING",
              },
              {
                userName: "Mirela",
                employeeId: "2f86f54b-677e-42e7-842e-e07c2a5672a8",
                userAvatar: null,
                userInitialColor: "#3c469b",
                approvalStatus: "PENDING",
              },
            ],
            docRevApprovedApprovals: [
              {
                userName: "Veronica  B",
                employeeId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
                userAvatar: null,
                userInitialColor: "#81d9ea",
                approvalStatus: "APPROVED",
              },
            ],
            id: "b1bc2900b9-9c72-4169-8b6e-c7412ae4103f",
            timestamp: "2021-11-10T06:20:15.339Z",
            type: "DIRECT_APPROVAL_REQ_APPROVER",
            purchaseOrderTotalAmount: "10.93",
            purchaseOrderCurrency: "USD",
            purchaseOrderDescription: "<p>test</p>",
            purchaseOrdeLineItemCount: 1,
            purchaseOrderAttachments: [
              {
                name: "Screenshot 2021-11-02 at 8.23.21 PM",
                type: "png",
                id: "239016bf-b0be-4775-b500-53a93967e518",
              },
              {
                name: "Screenshot 2021-11-02 at 9.46.44 AM",
                type: "png",
                id: "14da1dd4-f9f8-4ebb-8524-b0ab7b2a03d1",
              },
            ],
          },
          {
            approvalStatusChanged: "REJECTED",
            approvalId: "786deaad-155d-4960-b9df-99bd479affff",
            approverAvatar: null,
            approverName: "ZORON",
            approverInitialColor: "#3c469b",
            docId: "TDC-00153",
            docDocumentId: "33de63fd-d0f2-4dd8-8858-92498a750ee3",
            docRevName: "REJECTED DOC TEST",
            docRevId: "7234e0f2-5fd0-41f3-9127-0b4c30588b96",
            docRevStatus: "RELEASED",
            docRevOwnerName: "Mirela",
            docRevOwnerAvatar: null,
            docRevOwnerInitialColor: "#3c469b",
            docRevOwnerId: "062491dc-6a63-4038-a9bf-b8b625308870",
            docRevPendingApprovals: [],
            docRevApprovedApprovals: [
              {
                userName: "Mirela",
                employeeId: "062491dc-6a63-4038-a9bf-b8b625308870",
                userAvatar: null,
                userInitialColor: "#3c469b",
                approvalStatus: "APPROVED",
              },
            ],
            id: "95cd8d61-5f5c-4467-a00f-5b1fab57debc",
            timestamp: "2021-11-08T16:39:52.619Z",
            type: "DIRECT_APPROVAL_REQ_OWNER_APPROVER_APPROVED_OR_REJECTED",
          },
          {
            type: "PO START",
            status: "PO START",
          },
          {
            purchaseOrderSupplierDocRevId:
              "d177ff4c-5b66-4eaf-a953-b109e69e72bd",
            purchaseOrderSupplierDocId: "76e1e83c-2489-40dd-9acd-dfe9bada81db",
            purchaseSupplierName: "CC Enterprise",
            approvalStatusChanged: "UNDEFINED",
            docId: "PO-00482",
            docDocumentId: "6c86ccca-ff03-48f4-80d4-1c184af35c1b",
            docRevName: "",
            docRevId: "167da1ef-b28d-46e5-bccb-7e138708a205",
            docRevStatus: "IN_REVIEW",
            docRevOwnerName: "Veronica  B",
            docRevOwnerAvatar: null,
            docRevOwnerInitialColor: "#81d9ea",
            docRevOwnerId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
            docRevPendingApprovals: [
              {
                userName: "Maja Main acc",
                employeeId: "15b6aac9-9ad0-4d6f-8195-5f73d6e2bf33",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2F0c25dc24-3417-4414-a86a-435c2155cfe9%2F2021-11-08T14%253A08%253A09.401Z%2Fyellow.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075535891%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=dmcbgb2QuOFIVNBl3woYwgEgs6p6XfxKIuWHQZnXtX8%3D&amp;reserved=0",
                userInitialColor: "#f904e9",
                approvalStatus: "PENDING",
              },
            ],
            docRevApprovedApprovals: [
              {
                userName: "Veronica  B",
                employeeId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
                userAvatar: null,
                userInitialColor: "#81d9ea",
                approvalStatus: "APPROVED",
              },
            ],
            id: "8lkfeba7-59fd-439d-835b-5b8c5e7b2b74",
            timestamp: "2021-11-10T06:18:21.279Z",
            type: "DIRECT_PO_APPROVAL_REQ_OWNER",
            purchaseOrderTotalAmount: "10.93",
            purchaseOrderCurrency: "USD",
            purchaseOrderDescription: "<p>test</p>",
            purchaseOrdeLineItemCount: 1,
            purchaseOrderAttachments: [
              {
                name: "Screenshot 2021-11-02 at 8.23.21 PM",
                type: "png",
                id: "239016bf-b0be-4775-b500-53a93967e518",
              },
              {
                name: "Screenshot 2021-11-02 at 9.46.44 AM",
                type: "png",
                id: "14da1dd4-f9f8-4ebb-8524-b0ab7b2a03d1",
              },
            ],
          },
          {
            purchaseOrderSupplierDocRevId:
              "d177ff4c-5b66-4eaf-a953-b109e69e72bd",
            purchaseOrderSupplierDocId: "76e1e83c-2489-40dd-9acd-dfe9bada81db",
            purchaseSupplierName: "CC Enterprise",
            approvalStatusChanged: "UNDEFINED",
            approvalId: "18ed38cc-7d72-4e41-b04d-b7c960ceae14",
            approverName: "",
            approverAvatar: null,
            approverInitialColor: "#81d9ea",
            docId: "PO-00482",
            docDocumentId: "6c86ccca-ff03-48f4-80d4-1c184af35c1b",
            docRevName: "PO REQ NAME",
            docRevId: "167da1ef-b28d-46e5-bccb-7e138708a205",
            docRevStatus: "IN_REVIEW",
            docRevOwnerName: "Veronica  B",
            docRevOwnerAvatar: null,
            docRevOwnerInitialColor: "#81d9ea",
            docRevOwnerId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
            docRevPendingApprovals: [
              {
                userName: "Maja Main acc",
                employeeId: "15b6aac9-9ad0-4d6f-8195-5f73d6e2bf33",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2F0c25dc24-3417-4414-a86a-435c2155cfe9%2F2021-11-08T14%253A08%253A09.401Z%2Fyellow.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075535891%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=dmcbgb2QuOFIVNBl3woYwgEgs6p6XfxKIuWHQZnXtX8%3D&amp;reserved=0",
                userInitialColor: "#f904e9",
                approvalStatus: "PENDING",
              },
              {
                userName: "Julia Makarenko",
                employeeId: "222f9557-1dad-4953-a83f-893c811932fe",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2Fe2c3799b-a476-486d-b527-388b80006171%2F2020-07-19T09%253A58%253A50.126Z%2F0d.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075545886%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=SqGLfl2XZf5CG3iwZ4obyvrxr5vTeRQQWbYb%2B5%2FaEnI%3D&amp;reserved=0",
                userInitialColor: "#95f957",
                approvalStatus: "PENDING",
              },
              {
                userName: "Zoran Kovacevic",
                employeeId: "c15664b7-229e-45df-bdb3-8b37db294f6b",
                userAvatar: null,
                userInitialColor: "#ea746e",
                approvalStatus: "PENDING",
              },
              {
                userName: "Test1",
                employeeId: "e1e76f2f-cb14-4940-86c2-09aa45185236",
                userAvatar: null,
                userInitialColor: "#f3f99f",
                approvalStatus: "PENDING",
              },
              {
                userName: "Veronica +1",
                employeeId: "a51dfeed-6ee0-444e-8f97-26f8642c4c8e",
                userAvatar: null,
                userInitialColor: "#56d10a",
                approvalStatus: "PENDING",
              },
              {
                userName: "Mirela",
                employeeId: "2f86f54b-677e-42e7-842e-e07c2a5672a8",
                userAvatar: null,
                userInitialColor: "#3c469b",
                approvalStatus: "PENDING",
              },
            ],
            docRevApprovedApprovals: [
              {
                userName: "Veronica  B",
                employeeId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
                userAvatar: null,
                userInitialColor: "#81d9ea",
                approvalStatus: "APPROVED",
              },
            ],
            id: "b1bc20b9-9c72-4169-8b6e-c7412ae4103f",
            timestamp: "2021-11-10T06:20:15.339Z",
            type: "DIRECT_PO_APPROVAL_REQ_APPROVER",
            purchaseOrderTotalAmount: "10.93",
            purchaseOrderCurrency: "USD",
            purchaseOrderDescription: "<p>test</p>",
            purchaseOrdeLineItemCount: 1,
            purchaseOrderAttachments: [
              {
                name: "Screenshot 2021-11-02 at 8.23.21 PM",
                type: "png",
                id: "239016bf-b0be-4775-b500-53a93967e518",
              },
              {
                name: "Screenshot 2021-11-02 at 9.46.44 AM",
                type: "png",
                id: "14da1dd4-f9f8-4ebb-8524-b0ab7b2a03d1",
              },
            ],
          },
          {
            purchaseOrderSupplierDocRevId:
              "d177ff4c-5b66-4eaf-a953-b109e69e72bd",
            purchaseOrderSupplierDocId: "76e1e83c-2489-40dd-9acd-dfe9bada81db",
            purchaseSupplierName: "CC Enterprise",
            approvalStatusChanged: "REJECTED",
            approvalId: "18ed38cc-7d72-4e41-b04d-b7c960ceae14",
            approverName: "ABDUL",
            approverAvatar: null,
            approverInitialColor: "#81d9ea",
            docId: "PO-00482",
            docDocumentId: "6c86ccca-ff03-48f4-80d4-1c184af35c1b",
            docRevName: "REJECTED PO TEST",
            docRevId: "167da1ef-b28d-46e5-bccb-7e138708a205",
            docRevStatus: "IN_REVIEW",
            docRevOwnerName: "Veronica  B",
            docRevOwnerAvatar: null,
            docRevOwnerInitialColor: "#81d9ea",
            docRevOwnerId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
            docRevPendingApprovals: [
              {
                userName: "Maja Main acc",
                employeeId: "15b6aac9-9ad0-4d6f-8195-5f73d6e2bf33",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2F0c25dc24-3417-4414-a86a-435c2155cfe9%2F2021-11-08T14%253A08%253A09.401Z%2Fyellow.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075535891%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=dmcbgb2QuOFIVNBl3woYwgEgs6p6XfxKIuWHQZnXtX8%3D&amp;reserved=0",
                userInitialColor: "#f904e9",
                approvalStatus: "PENDING",
              },
              {
                userName: "Julia Makarenko",
                employeeId: "222f9557-1dad-4953-a83f-893c811932fe",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2Fe2c3799b-a476-486d-b527-388b80006171%2F2020-07-19T09%253A58%253A50.126Z%2F0d.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075545886%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=SqGLfl2XZf5CG3iwZ4obyvrxr5vTeRQQWbYb%2B5%2FaEnI%3D&amp;reserved=0",
                userInitialColor: "#95f957",
                approvalStatus: "PENDING",
              },
              {
                userName: "Zoran Kovacevic",
                employeeId: "c15664b7-229e-45df-bdb3-8b37db294f6b",
                userAvatar: null,
                userInitialColor: "#ea746e",
                approvalStatus: "PENDING",
              },
              {
                userName: "Test1",
                employeeId: "e1e76f2f-cb14-4940-86c2-09aa45185236",
                userAvatar: null,
                userInitialColor: "#f3f99f",
                approvalStatus: "PENDING",
              },
              {
                userName: "Veronica +1",
                employeeId: "a51dfeed-6ee0-444e-8f97-26f8642c4c8e",
                userAvatar: null,
                userInitialColor: "#56d10a",
                approvalStatus: "PENDING",
              },
              {
                userName: "Mirela",
                employeeId: "2f86f54b-677e-42e7-842e-e07c2a5672a8",
                userAvatar: null,
                userInitialColor: "#3c469b",
                approvalStatus: "PENDING",
              },
            ],
            docRevApprovedApprovals: [
              {
                userName: "Veronica  B",
                employeeId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
                userAvatar: null,
                userInitialColor: "#81d9ea",
                approvalStatus: "APPROVED",
              },
            ],
            id: "b1bc90020b9-9c72-4169-8b6e-c7412ae4103f",
            timestamp: "2021-11-10T06:20:15.339Z",
            type: "DIRECT_PO_APPROVAL_REQ_OWNER_APPROVER_APPROVED",
            purchaseOrderTotalAmount: "10.93",
            purchaseOrderCurrency: "USD",
            purchaseOrderDescription: "<p>test</p>",
            purchaseOrdeLineItemCount: 1,
            purchaseOrderAttachments: [
              {
                name: "Screenshot 2021-11-02 at 8.23.21 PM",
                type: "png",
                id: "239016bf-b0be-4775-b500-53a93967e518",
              },
              {
                name: "Screenshot 2021-11-02 at 9.46.44 AM",
                type: "png",
                id: "14da1dd4-f9f8-4ebb-8524-b0ab7b2a03d1",
              },
            ],
          },
          {
            purchaseOrderSupplierDocRevId:
              "d177ff4c-5b66-4eaf-a953-b109e69e72bd",
            purchaseOrderSupplierDocId: "76e1e83c-2489-40dd-9acd-dfe9bada81db",
            purchaseSupplierName: "CC Enterprise",
            approvalStatusChanged: "APPROVED",
            approvalId: "18ed38cc-7d72-4e41-b04d-b7c960ceae14",
            approverName: "Ramesh",
            approverAvatar: null,
            approverInitialColor: "#81d9ea",
            docId: "PO-00482",
            docDocumentId: "6c86ccca-ff03-48f4-80d4-1c184af35c1b",
            docRevName: "APPROVED TEST DOC",
            docRevId: "167da1ef-b28d-46e5-bccb-7e138708a205",
            docRevStatus: "IN_REVIEW",
            docRevOwnerName: "Veronica  B",
            docRevOwnerAvatar: null,
            docRevOwnerInitialColor: "#81d9ea",
            docRevOwnerId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
            docRevPendingApprovals: [
              {
                userName: "Maja Main acc",
                employeeId: "15b6aac9-9ad0-4d6f-8195-5f73d6e2bf33",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2F0c25dc24-3417-4414-a86a-435c2155cfe9%2F2021-11-08T14%253A08%253A09.401Z%2Fyellow.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075535891%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=dmcbgb2QuOFIVNBl3woYwgEgs6p6XfxKIuWHQZnXtX8%3D&amp;reserved=0",
                userInitialColor: "#f904e9",
                approvalStatus: "PENDING",
              },
              {
                userName: "Julia Makarenko",
                employeeId: "222f9557-1dad-4953-a83f-893c811932fe",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2Fe2c3799b-a476-486d-b527-388b80006171%2F2020-07-19T09%253A58%253A50.126Z%2F0d.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075545886%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=SqGLfl2XZf5CG3iwZ4obyvrxr5vTeRQQWbYb%2B5%2FaEnI%3D&amp;reserved=0",
                userInitialColor: "#95f957",
                approvalStatus: "PENDING",
              },
              {
                userName: "Zoran Kovacevic",
                employeeId: "c15664b7-229e-45df-bdb3-8b37db294f6b",
                userAvatar: null,
                userInitialColor: "#ea746e",
                approvalStatus: "PENDING",
              },
              {
                userName: "Test1",
                employeeId: "e1e76f2f-cb14-4940-86c2-09aa45185236",
                userAvatar: null,
                userInitialColor: "#f3f99f",
                approvalStatus: "PENDING",
              },
              {
                userName: "Veronica +1",
                employeeId: "a51dfeed-6ee0-444e-8f97-26f8642c4c8e",
                userAvatar: null,
                userInitialColor: "#56d10a",
                approvalStatus: "PENDING",
              },
              {
                userName: "Mirela",
                employeeId: "2f86f54b-677e-42e7-842e-e07c2a5672a8",
                userAvatar: null,
                userInitialColor: "#3c469b",
                approvalStatus: "PENDING",
              },
            ],
            docRevApprovedApprovals: [
              {
                userName: "Veronica  B",
                employeeId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
                userAvatar: null,
                userInitialColor: "#81d9ea",
                approvalStatus: "APPROVED",
              },
            ],
            id: "bopbc20b9-9c72-4169-8b6e-c7412ae4103f",
            timestamp: "2021-11-10T06:20:15.339Z",
            type: "DIRECT_PO_APPROVAL_REQ_OWNER_APPROVER_APPROVED",
            purchaseOrderTotalAmount: "10.93",
            purchaseOrderCurrency: "USD",
            purchaseOrderDescription: "<p>test</p>",
            purchaseOrdeLineItemCount: 1,
            purchaseOrderAttachments: [
              {
                name: "Screenshot 2021-11-02 at 8.23.21 PM",
                type: "png",
                id: "239016bf-b0be-4775-b500-53a93967e518",
              },
              {
                name: "Screenshot 2021-11-02 at 9.46.44 AM",
                type: "png",
                id: "14da1dd4-f9f8-4ebb-8524-b0ab7b2a03d1",
              },
            ],
          },
          {
            purchaseOrderSupplierDocRevId:
              "d177ff4c-5b66-4eaf-a953-b109e69e72bd",
            purchaseOrderSupplierDocId: "76e1e83c-2489-40dd-9acd-dfe9bada81db",
            purchaseSupplierName: "CC Enterprise",
            approvalStatusChanged: "UNDEFINED",
            docId: "PO-00482",
            docDocumentId: "6c86ccca-ff03-48f4-80d4-1c184af35c1b",
            docRevName: "PO APPROVED/RELEASED TEST",
            docRevId: "167da1ef-b28d-46e5-bccb-7e138708a205",
            docRevStatus: "RELEASED",
            docRevOwnerName: "Veronica  B",
            docRevOwnerAvatar: null,
            docRevOwnerInitialColor: "#81d9ea",
            docRevOwnerId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
            docRevPendingApprovals: [],
            docRevApprovedApprovals: [
              {
                userName: "Veronica  B",
                employeeId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
                userAvatar: null,
                userInitialColor: "#81d9ea",
                approvalStatus: "APPROVED",
              },
            ],
            id: "8edfeba7-59fd-439d-835b-5b8c5e7b2b74",
            timestamp: "2021-11-10T06:18:21.279Z",
            type: "DIRECT_PO_APPROVAL_REQ_OWNER",
            purchaseOrderTotalAmount: "10.93",
            purchaseOrderCurrency: "USD",
            purchaseOrderDescription: "<p>test</p>",
            purchaseOrdeLineItemCount: 1,
            purchaseOrderAttachments: [
              {
                name: "Screenshot 2021-11-02 at 8.23.21 PM",
                type: "png",
                id: "239016bf-b0be-4775-b500-53a93967e518",
              },
              {
                name: "Screenshot 2021-11-02 at 9.46.44 AM",
                type: "png",
                id: "14da1dd4-f9f8-4ebb-8524-b0ab7b2a03d1",
              },
            ],
          },
          {
            type: "AR START",
            status: "AR START",
          },
          {
            docRevs: [
              {
                documentRevisionId: "5ec4ad6a-a501-4ce9-9674-034c2fac254a",
                documentId: "0f180761-0409-483b-9296-e6c4cc86e631",
                docId: "FM-00302",
                displayRevision: "1",
                name: "AR test 1",
                justificationOfChange: "N/A (Numeric Release)",
                descriptionOfChange: "N/A (Numeric Release)",
              },
            ],
            arId: "AR-00039",
            arChangeRequestId: "6281b73e-f658-4f19-886a-c6b85c8d3e6d",
            arTitle: "IN REVIEW TEST",
            arStatus: "IN_REVIEW",
            approvedApprovers: [
              {
                userName: "Test1 AP",
                employeeId: "e12e76f2f-cb14-4940-86c2-09aa45185236",
                userAvatar: null,
                userInitialColor: "#f3f99f",
                approvalStatus: "APPROVED",
              },
              {
                userName: "Veronica +1 AP",
                employeeId: "a512dfeed-6ee0-444e-8f97-26f8642c4c8e",
                userAvatar: null,
                userInitialColor: "#56d10a",
                approvalStatus: "APPROVED",
              },
              {
                userName: "Mirela AP",
                employeeId: "2f865f54b-677e-42e7-842e-e07c2a5672a8",
                userAvatar: null,
                userInitialColor: "#3c469b",
                approvalStatus: "APPROVED",
              },
            ],
            pendingApprovers: [
              {
                userName: "Maja Main acc",
                employeeId: "15b6aac9-9ad0-4d6f-8195-5f73d6e2bf33",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2F0c25dc24-3417-4414-a86a-435c2155cfe9%2F2021-11-08T14%253A08%253A09.401Z%2Fyellow.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075535891%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=dmcbgb2QuOFIVNBl3woYwgEgs6p6XfxKIuWHQZnXtX8%3D&amp;reserved=0",
                userInitialColor: "#f904e9",
                approvalStatus: "PENDING",
              },
              {
                userName: "Julia Makarenko",
                employeeId: "222f9557-1dad-4953-a83f-893c811932fe",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2Fe2c3799b-a476-486d-b527-388b80006171%2F2020-07-19T09%253A58%253A50.126Z%2F0d.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075545886%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=SqGLfl2XZf5CG3iwZ4obyvrxr5vTeRQQWbYb%2B5%2FaEnI%3D&amp;reserved=0",
                userInitialColor: "#95f957",
                approvalStatus: "PENDING",
              },
              {
                userName: "Zoran Kovacevic",
                employeeId: "c15664b7-229e-45df-bdb3-8b37db294f6b",
                userAvatar: null,
                userInitialColor: "#ea746e",
                approvalStatus: "PENDING",
              },
              {
                userName: "Test1",
                employeeId: "e1e76f2f-cb14-4940-86c2-09aa45185236",
                userAvatar: null,
                userInitialColor: "#f3f99f",
                approvalStatus: "PENDING",
              },
              {
                userName: "Veronica +1",
                employeeId: "a51dfeed-6ee0-444e-8f97-26f8642c4c8e",
                userAvatar: null,
                userInitialColor: "#56d10a",
                approvalStatus: "PENDING",
              },
              {
                userName: "Mirela",
                employeeId: "2f86f54b-677e-42e7-842e-e07c2a5672a8",
                userAvatar: null,
                userInitialColor: "#3c469b",
                approvalStatus: "PENDING",
              },
            ],
            id: "5e391040-195c-457e-9909-cf985bc42e1a",
            timestamp: "2021-11-03T12:39:36.215Z",
            type: "APPROVAL_REQ_OWNER",
          },
          {
            docRevs: [
              {
                documentRevisionId: "fc5c4667-ffdb-43ac-83b5-baf084eb2be0",
                documentId: "abfda900-92d9-449e-8ec2-285f510b47dd",
                docId: "FM-00902",
                displayRevision: "2",
                name: "test ad",
                justificationOfChange: "Test",
                descriptionOfChange: "Test",
              },
            ],
            arId: "AR00849",
            arChangeRequestId: "02358497-19c6-412f-8ac4-cff69fefcd50",
            arTitle: "Image Migration",
            arStatus: "IN_REVIEW",
            pendingApprovers: [
              {
                employeeId: "e1e76f2f-cb14-4940-86c2-09aa45185236",
                userName: "Test1",
              },
              {
                employeeId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
                userName: "Veronica  B",
              },
            ],
            approvalId: "463e9f8f-b263-4e2e-a675-c8623270eb82",
            approverAvatar: null,
            approverInitialColor: "#81d9ea",
            ownerAvatar: null,
            ownerInitialColor: "#81d9ea",
            ownerEmployeeId: "",
            onwerName: "Shiv",
            id: "8171975a-91b8-4908-9e8e-c95d32af2bb2",
            timestamp: "2021-11-10T06:46:30.203Z",
            type: "APPROVAL_REQ_APPROVER",
          },
          {
            docRevs: [
              {
                documentRevisionId: "5ec4ad6a-a501-4ce9-9674-034c2fac254a",
                documentId: "0f180761-0409-483b-9296-e6c4cc86e631",
                docId: "FM-00302",
                displayRevision: "1",
                name: "AR test 1",
                justificationOfChange: "N/A (Numeric Release)",
                descriptionOfChange: "N/A (Numeric Release)",
              },
            ],
            arId: "AR-00036",
            arChangeRequestId: "6281b73e-f658-4f19-886a-c6b85c8d3e6d",
            arTitle: "TEST DOC",
            arStatus: "CLOSED",
            approvedApprovers: [
              {
                userName: "Maja Main acc",
                employeeId: "15b6aac9-9ad0-4d6f-8195-5f73d6e2bf33",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2F0c25dc24-3417-4414-a86a-435c2155cfe9%2F2021-11-08T14%253A08%253A09.401Z%2Fyellow.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075535891%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=dmcbgb2QuOFIVNBl3woYwgEgs6p6XfxKIuWHQZnXtX8%3D&amp;reserved=0",
                userInitialColor: "#f904e9",
                approvalStatus: "APPROVED",
              },
            ],
            pendingApprovers: [],
            id: "9lko040-195c-457e-9909-cf985bc42e1a",
            timestamp: "2021-11-03T12:39:36.215Z",
            type: "APPROVAL_REQ_OWNER",
          },
          {
            docRevs: [
              {
                documentRevisionId: "5ec4ad6a-a501-4ce9-9674-034c2fac254a",
                documentId: "0f180761-0409-483b-9296-e6c4cc86e631",
                docId: "FM-00302",
                displayRevision: "1",
                name: "AR test 1",
                justificationOfChange: "N/A (Numeric Release)",
                descriptionOfChange: "N/A (Numeric Release)",
              },
            ],
            arId: "AR-00037",
            arChangeRequestId: "6281b73e-f658-4f19-886a-c6b85c8d3e6d",
            arTitle: "Approved Doc",
            arStatus: "APPROVED",
            approvedApprovers: [
              {
                userName: "Maja Main acc",
                employeeId: "15b6aac9-9ad0-4d6f-8195-5f73d6e2bf33",
                userAvatar:
                  "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdoc-be-dev-public.s3.us-west-2.amazonaws.com%2F0c25dc24-3417-4414-a86a-435c2155cfe9%2F2021-11-08T14%253A08%253A09.401Z%2Fyellow.jpg&amp;data=04%7C01%7Cajain%40enlil.com%7C688c357809af4407bcc308d9a8c1af2a%7C89047372207d4db384b9cc39cb3a2c23%7C0%7C0%7C637726372075535891%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&amp;sdata=dmcbgb2QuOFIVNBl3woYwgEgs6p6XfxKIuWHQZnXtX8%3D&amp;reserved=0",
                userInitialColor: "#f904e9",
                approvalStatus: "APPROVED",
              },
            ],
            pendingApprovers: [],
            id: "5e491040-195c-457e-9909-cf985bc42f1a",
            timestamp: "2021-11-03T12:39:36.215Z",
            type: "APPROVAL_REQ_OWNER",
          },
          {
            approvalStatusChanged: "REJECTED",
            docRevs: [
              {
                documentRevisionId: "fc5c4667-ffdb-43ac-83b5-baf084eb2be0",
                documentId: "abfda900-92d9-449e-8ec2-285f510b47dd",
                docId: "FM-00902",
                displayRevision: "2",
                name: "test ad",
                justificationOfChange: "Test",
                descriptionOfChange: "Test",
              },
            ],
            arId: "AR00849",
            arChangeRequestId: "02358497-19c6-412f-8ac4-cff69fefcd50",
            arTitle: "Rejected Doc",
            arStatus: "IN_REVIEW",
            pendingApprovers: [
              {
                employeeId: "e1e76f2f-cb14-4940-86c2-09aa45185236",
                userName: "Test1",
              },
              {
                employeeId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
                userName: "Veronica  B",
              },
            ],
            approvalId: "463e9f8f-b263-4e2e-a675-c8623270eb82",
            approverAvatar: null,
            approverName: "Nishanth",
            approverInitialColor: "#81d9ea",
            id: "75b3kf59-0c77-447e-b520-2d821b3a2d5e",
            timestamp: "2021-11-10T06:41:59.155Z",
            type: "APPROVAL_REQ_OWNER_APPROVER_APPROVED_OR_REJECTED",
          },
          {
            approvalStatusChanged: "APPROVED",
            docRevs: [
              {
                documentRevisionId: "fc5c4667-ffdb-43ac-83b5-baf084eb2be0",
                documentId: "abfda900-92d9-449e-8ec2-285f510b47dd",
                docId: "FM-00902",
                displayRevision: "2",
                name: "test ad",
                justificationOfChange: "Test",
                descriptionOfChange: "Test",
              },
            ],
            arId: "AR00849",
            arChangeRequestId: "02358497-19c6-412f-8ac4-cff69fefcd50",
            arTitle: "AR APPROVED",
            arStatus: "IN_REVIEW",
            pendingApprovers: [
              {
                employeeId: "e1e76f2f-cb14-4940-86c2-09aa45185236",
                userName: "Test1",
              },
              {
                employeeId: "8e9ec3f2-3c93-4456-9e4c-d12e30a6a01d",
                userName: "Veronica  B",
              },
            ],
            approvalId: "463e9f8f-b263-4e2e-a675-c8623270eb82",
            approverAvatar: null,
            approverName: "GANESH",
            approverInitialColor: "#81d9ea",
            id: "75b3df58-0c77-447e-b520-2d821b1a2d5e",
            timestamp: "2021-11-10T06:41:59.155Z",
            type: "APPROVAL_REQ_OWNER_APPROVER_APPROVED_OR_REJECTED",
          },
          {
            type: "Preventive Maintaince START",
            status: "Preventive Maintaince Start",
          },
          {
            docId: "EQ-00001",
            docDocumentId: "1bd90ec7-de22-4f04-ba45-81510ee424cb",
            docRevName: "Equipment 1",
            docRevId: "1526156e-7da7-428a-91ec-4471ebc68e2b",
            docRevOwnerId: "a964a68d-d00e-4257-9df0-f6d5df18b4e0",
            id: "779429d7-207f-44d2-9452-2b308f07ad36",
            timestamp: "2021-11-14T07:15:34.576Z",
            type: "EQ_MAINTENANCE_OWNER_OR_COORDINATOR",
            equipmentInterval: 7,
          },
          {
            docId: "EQ-00002",
            docDocumentId: "9228bfcd-fe03-43a4-8ede-23d6be9379a7",
            docRevName: "Equipment 2",
            docRevId: "e89ea5b2-bcb8-4845-bde8-00060672cc6a",
            docRevOwnerId: "a964a68d-d00e-4257-9df0-f6d5df18b4e0",
            id: "149cbbd3-957c-4a84-b9ce-af00923be209",
            timestamp: "2021-11-14T07:15:34.463Z",
            type: "EQ_MAINTENANCE_OWNER_OR_COORDINATOR",
            equipmentInterval: 7,
          },
          {
            docId: "EQ-00004",
            docDocumentId: "44563d2f-e10a-46b6-8d8d-bbdfbfea5e6f",
            docRevName: "Equipment for Demo Purpose",
            docRevId: "dcd17659-a3ae-4623-923a-71565b9935b8",
            docRevOwnerId: "a964a68d-d00e-4257-9df0-f6d5df18b4e0",
            id: "46bb4fc7-b926-4247-bab4-51a356e54f9e",
            timestamp: "2021-11-14T07:15:34.352Z",
            type: "EQ_MAINTENANCE_OWNER_OR_COORDINATOR",
            equipmentInterval: 30,
          },
          {
            type: "Calibration START",
            status: "Calibration Start",
          },
          {
            docId: "EQ-00002",
            docDocumentId: "6c134dab-303f-45b1-9a45-b21bfc06f62b",
            docRevName: "Utah Cable",
            docRevId: "aea3bd70-2295-4191-bb60-b2cb848adb3f",
            docRevOwnerId: "9f769ce5-2124-4ac0-bc30-ef21853fb033",
            id: "cec56c59-6a3a-44b5-8e4d-9b1ad0ca4e9b",
            timestamp: "2021-11-14T07:15:19.328Z",
            type: "EQ_CALIBRATION_OWNER_OR_COORDINATOR",
            equipmentInterval: 30,
          },
          {
            docId: "EQ-00003",
            docDocumentId: "6c134dab-303f-45b1-9a45-b21bfc06f62b",
            docRevName: "Utah Cable",
            docRevId: "aea3bd70-2295-4191-bb60-b2cb848adb3f",
            docRevOwnerId: "9f769ce5-2124-4ac0-bc30-ef21853fb033",
            id: "cec56c59-6a3a-44b5-8e4d-9b1ad0ca4e9b",
            timestamp: "2021-11-14T07:15:19.328Z",
            type: "EQ_CALIBRATION_OWNER_OR_COORDINATOR",
            equipmentInterval: 7,
          },
          {
            type: "Training START",
            status: "Training Start",
          },
          {
            trainingStatus: "DUMMY",
            dueOn: "2021-11-15T08:00:00.000Z",
            trainingRecordId: "7ffffc73-b1ee-48ce-8403-c2ae273418a9",
            trId: "TRN-00001",
            docId: "LOT-00002",
            docDocumentId: "0f0b604e-25a5-4669-bf30-2a0e08fe6723",
            docRevName: "aa",
            docRevId: "ee76a29b-b15f-4f3b-aa83-eb069df6bed4",
            id: "5c2c4444-8e9c-895e-babb-d8b8eb4c7894",
            timestamp: "2021-11-13T14:23:53.214Z",
            type: "TRAINING_STATUS_TRAINEE",
          },
          {
            trainingStatus: "ASSIGNED",
            dueOn: "2021-11-15T08:00:00.000Z",
            trainingRecordId: "7ffffc73-b1ee-48ce-8403-c2ae273418a9",
            trId: "TRN-00001",
            docId: "LOT-00002",
            docDocumentId: "0f0b604e-25a5-4669-bf30-2a0e08fe6723",
            docRevName: "aa",
            docRevId: "ee76a29b-b15f-4f3b-aa83-eb069df6bed4",
            id: "5c2c4444-8e9c-895e-babb-d8b8eb4c7894",
            timestamp: "2021-11-13T14:23:53.214Z",
            type: "TRAINING_STATUS_TRAINEE",
          },
          {
            trainingStatus: "OVERDUE",
            dueOn: "2021-11-15T08:00:00.000Z",
            trainingRecordId: "7ffffc73-b1ee-48ce-8403-c2ae273418a9",
            trId: "TRN-00001",
            docId: "LOT-00002",
            docDocumentId: "0f0b604e-25a5-4669-bf30-2a0e08fe6723",
            docRevName: "aa",
            docRevId: "ee76a29b-b15f-4f3b-aa83-eb069df6bed4",
            id: "5c2c4444-8e99-475e-babb-d8b8eb4c7894",
            timestamp: "2021-11-13T14:23:53.214Z",
            type: "TRAINING_STATUS_TRAINEE",
          },
          {
            trainingStatus: "DUE",
            dueOn: "2021-11-15T08:00:00.000Z",
            trainingRecordId: "7ffffc73-b1ee-48ce-8403-c2ae273418a9",
            trId: "TRN-00001",
            docId: "LOT-00002",
            docDocumentId: "0f0b604e-25a5-4669-bf30-2a0e08fe6723",
            docRevName: "aa",
            docRevId: "ee76a29b-b15f-4f3b-aa83-eb069df6bed4",
            id: "5p2c4444-8e9c-475e-babb-d8b8eb4c7894",
            timestamp: "2021-11-13T14:23:53.214Z",
            type: "TRAINING_STATUS_TRAINEE",
          },
          {
            trainingStatus: "COMPLETED",
            dueOn: "2021-11-15T08:00:00.000Z",
            trainingRecordId: "7ffffc73-b1ee-48ce-8403-c2ae273418a9",
            trId: "TRN-00001",
            docId: "LOT-00002",
            docDocumentId: "0f0b604e-25a5-4669-bf30-2a0e08fe6723",
            docRevName: "aa",
            docRevId: "ee76a29b-b15f-4f3b-aa83-eb069df6bed4",
            id: "5c2l4444-8e9c-475e-babb-d8b8eb4c7894",
            timestamp: "2021-11-13T14:23:53.214Z",
            type: "TRAINING_STATUS_TRAINEE",
          },
        ])
        .map((pendingAction, index) => {
          switch (pendingAction.type) {
            case ActionTypes.EQ_MAINTENANCE_OWNER_OR_COORDINATOR:
            case ActionTypes.EQ_CALIBRATION_OWNER_OR_COORDINATOR:
              return (
                <CalibrationItem
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
                  docRevName={pendingAction.docRevName}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            case ActionTypes.DIRECT_APPROVAL_REQ_APPROVER:
              return (
                <NONPOTaskApproval
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
                  docRevName={pendingAction.docRevName}
                  onMouseHoverItem={onMouseHoverItem}
                  hoverItemId={hoverItemId}
                />
              );
            case ActionTypes.DIRECT_PO_APPROVAL_REQ_OWNER_APPROVER_APPROVED:
              return (
                <POApproverActions
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
