import React, { useEffect } from "react";
import { IotService } from "../../../common/utils/iot/mqttClient";
import ChangeRequestListSockets from "./ChangeRequestListSockets";

const SocketsContainer: React.FunctionComponent = () => {
  useEffect(() => () => {
    const iotService = IotService.getInstance();
    iotService.unsubscribeAll();
  }, []);

  return <ChangeRequestListSockets />;
};

export default SocketsContainer;
