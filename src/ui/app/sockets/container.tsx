import React from 'react';
import ChangeRequestListSockets from './ChangeRequestListSockets';
import DashboardTodoSockets from './DashboradTodoSocket';
import DocumentTypeSockets from './DocumentTypeSockets';
import EmployeeListSockets from './EmployeeListSockets';
import GroupsListSockets from './GroupsListSockets';

const SocketsContainer: React.FunctionComponent = () => (
  <>
    <ChangeRequestListSockets />
    <EmployeeListSockets />
    <GroupsListSockets />
    <DocumentTypeSockets />
    <DashboardTodoSockets />
  </>
);

export default SocketsContainer;
