/* eslint-disable react/react-in-jsx-scope */
import React from "react";
import MyFeedsLineItemPresenter from "./MyFeeds.presenter";
const feedItems = [
  {
    docRevs: [
      {
        documentRevisionId: "1a192507-7cf1-4581-a70e-41285e1d5c99",
        documentId: "6a824174-3be8-4f66-8bc8-f95d7cdb1732",
        docId: "FM-00861",
        displayRevision: "1",
        name: "Equipment Form ",
        justificationOfChange: "Justification of change\n",
        descriptionOfChange: "Description of change\n",
      },
    ],
    arId: "DCO-00809",
    arStatus: "CLOSED",
    pendingApprovers: [],
    id: "300c586a-74b3-474e-9a3a-7984c0134f91",
    timestamp: "2021-10-21T11:30:18.903Z",
    type: "APPROVAL_REQ_OWNER",
  },
  {
    docRevs: [
      {
        documentRevisionId: "e85b4d7b-98ec-4fe2-898b-87fb49252cf0",
        documentId: "9c94865e-0e1c-42d4-a18e-33def8a612f8",
        docId: "FM-01078",
        displayRevision: "1",
        name: "Mirela test 4",
        justificationOfChange: "Justification",
        descriptionOfChange: "Description",
      },
    ],
    arId: "DCO-00808",
    arStatus: "APPROVED",
    pendingApprovers: [],
    id: "bd2ee880-0122-4817-803d-7a6b2b8bafeb",
    timestamp: "2021-10-21T11:29:26.157Z",
    type: "APPROVAL_REQ_OWNER",
  },
  {
    docRevs: [
      {
        documentRevisionId: "1c0603ca-b178-4b02-a4d7-88c9584d9fb9",
        documentId: "42d8a47b-4c58-4121-9a50-ad5967c979b1",
        docId: "AAD00002",
        displayRevision: "1",
        name: "asdf",
        justificationOfChange: "Justification of 1st document",
        descriptionOfChange: "Description of 1st document",
      },
    ],
    arId: "DCO-00807",
    arStatus: "IN_REVIEW",
    pendingApprovers: [
      {
        employeeId: "09195c45-e2f3-4717-acb8-a21010bafdfd",
        userName: "Zoran Kovacevic",
      },
    ],
    id: "ab977165-56b1-4fca-8a61-e1ad20b5bfea",
    timestamp: "2021-10-21T11:26:36.838Z",
    type: "APPROVAL_REQ_APPROVER",
  },
  {
    docRevs: [
      {
        documentRevisionId: "1c0603ca-b178-4b02-a4d7-88c9584d9fb9",
        documentId: "42d8a47b-4c58-4121-9a50-ad5967c979b1",
        docId: "AAD00002",
        displayRevision: "1",
        name: "asdf",
        justificationOfChange: "Justification of 1st document",
        descriptionOfChange: "Description of 1st document",
      },
    ],
    arId: "DCO-00807",
    arStatus: "IN_REVIEW",
    pendingApprovers: [
      {
        employeeId: "09195c45-e2f3-4717-acb8-a21010bafdfd",
        userName: "Zoran Kovacevic",
      },
    ],
    id: "b394df63-c513-4f77-b03b-7ada41a32e53",
    timestamp: "2021-10-21T11:26:36.838Z",
    type: "APPROVAL_REQ_OWNER",
  },
  {
    docId: "RO02319",
    docRevName: "DocRev with Direct approval in IN REVIEW state",
    docRevStatus: "IN_REVIEW",
    docRevOwnerName: "Zoran Kovacevic",
    docRevOwnerAvatar: null,
    docRevOwnerId: "09195c45-e2f3-4717-acb8-a21010bafdfd",
    docRevPendingApprovals: [
      {
        userName: "Zoran Kovacevic",
        employeeId: "09195c45-e2f3-4717-acb8-a21010bafdfd",
        userAvatar: null,
        approvalStatus: "PENDING",
      },
      {
        userName: "Clarissa Clariza",
        employeeId: "cd04128f-e6d9-4c72-be83-9d1346df3420",
        userAvatar:
          "https://doc-be-prod-public.s3.us-west-2.amazonaws.com/cdce82eb-bf68-481e-af5f-f9c16853d7c0/2020-03-12T06%3A13%3A43.527Z/avatar61.jpg",
        approvalStatus: "PENDING",
      },
    ],
    docRevApprovedApprovals: [],
    id: "8308c93c-b9bf-4efd-b1d2-bbc19ba48a21",
    timestamp: "2021-10-21T11:24:30.136Z",
    type: "DIRECT_APPROVAL_REQ_APPROVER",
  },
  {
    docId: "RO02319",
    docRevName: "DocRev with Direct approval in IN REVIEW state",
    docRevStatus: "IN_REVIEW",
    docRevOwnerName: "Zoran Kovacevic",
    docRevOwnerAvatar: null,
    docRevOwnerId: "09195c45-e2f3-4717-acb8-a21010bafdfd",
    docRevPendingApprovals: [
      {
        userName: "Zoran Kovacevic",
        employeeId: "09195c45-e2f3-4717-acb8-a21010bafdfd",
        userAvatar: null,
        approvalStatus: "PENDING",
      },
      {
        userName: "Clarissa Clariza",
        employeeId: "cd04128f-e6d9-4c72-be83-9d1346df3420",
        userAvatar:
          "https://doc-be-prod-public.s3.us-west-2.amazonaws.com/cdce82eb-bf68-481e-af5f-f9c16853d7c0/2020-03-12T06%3A13%3A43.527Z/avatar61.jpg",
        approvalStatus: "PENDING",
      },
    ],
    docRevApprovedApprovals: [],
    id: "097680e1-f980-4036-9cd9-4d6aff32b57e",
    timestamp: "2021-10-21T11:24:30.136Z",
    type: "DIRECT_APPROVAL_REQ_OWNER",
  },
  {
    docId: "RO02317",
    docRevName: "test",
    docRevStatus: "DRAFT",
    docRevOwnerName: "Zoran Kovacevic",
    docRevOwnerAvatar: null,
    docRevOwnerId: "09195c45-e2f3-4717-acb8-a21010bafdfd",
    docRevPendingApprovals: [
      {
        userName: "Zoran Kovacevic",
        employeeId: "09195c45-e2f3-4717-acb8-a21010bafdfd",
        userAvatar: null,
        approvalStatus: "PENDING",
      },
    ],
    docRevApprovedApprovals: [],
    id: "83ba9e6b-7654-4a11-a1e2-aa398f96c8d5",
    timestamp: "2021-10-21T11:17:00.402Z",
    type: "APPROVAL_REQ_INLINE_APPROVER",
  },
  {
    docRevStatus: "DRAFT",
    id: "83ba9e6b-7654-4a11-a1e2-aa398f96c8d5",
    type: "DEFAULT",
  },
];
const MyFeedsLineItemsContainer: React.FunctionComponent = () => (
  <MyFeedsLineItemPresenter {...{ feedItems }} />
);

export default MyFeedsLineItemsContainer;
