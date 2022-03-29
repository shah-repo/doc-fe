import React, { useEffect } from "react";
import { IotService } from "../../../common/utils/iot/iotService";
import ChangeRequestListSockets from "./ChangeRequestListSockets";
import DocumentTypeSockets from "./DocumentTypeSockets";
import EmployeeListSockets from "./EmployeeListSockets";
import GroupsListSockets from "./GroupsListSockets";

const SocketsContainer: React.FunctionComponent = () => {
  useEffect(() => () => {
    const iotService = IotService.getInstance();
    iotService.unsubscribeAll();
  }, []);

  return (
    <>
      <ChangeRequestListSockets />
      <EmployeeListSockets />
      <GroupsListSockets />
      <DocumentTypeSockets />
    </>
  );
};

export default SocketsContainer;
