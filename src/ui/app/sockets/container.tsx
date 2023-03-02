import React from "react";
import ApproverReleaseSockets from "./ApproverReleaseSockets";
import ChangeRequestListSockets from "./ChangeRequestListSockets";
import DocumentTypeSockets from "./DocumentTypeSockets";
import EmployeeListSockets from "./EmployeeListSockets";
import GroupsListSockets from "./GroupsListSockets";

const SocketsContainer: React.FunctionComponent = () => (
  <>
    <ChangeRequestListSockets />
    <EmployeeListSockets />
    <GroupsListSockets />
    <DocumentTypeSockets />
    <ApproverReleaseSockets />
  </>
);

export default SocketsContainer;
