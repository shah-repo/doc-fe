import React from 'react';
import ChangeRequestListSockets from './ChangeRequestListSockets';
import DocumentTypeSockets from './DocumentTypeSockets';
import EmployeeListSockets from './EmployeeListSockets';
import GroupsListSockets from './GroupsListSockets';

const SocketsContainer: React.FunctionComponent = () => (
  <>
    <ChangeRequestListSockets />
    <EmployeeListSockets />
    <GroupsListSockets />
    <DocumentTypeSockets />
  </>
);

export default SocketsContainer;
