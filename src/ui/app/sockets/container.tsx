import React, { useEffect } from "react";
import { IotService } from "../../../common/utils/iot/mqttClient";
import ChangeRequestListSockets from "./ChangeRequestListSockets";
import DocumentTypeSockets from "./DocumentTypeSockets";
import EmployeeListSockets from "./EmployeeListSockets";

const SocketsContainer: React.FunctionComponent = () => {
  useEffect(() => () => {
    const iotService = IotService.getInstance();
    iotService.unsubscribeAll();
  }, []);

  return (
    <>
      <ChangeRequestListSockets />
      <EmployeeListSockets />
      <DocumentTypeSockets />
    </>
  );
};

export default SocketsContainer;
