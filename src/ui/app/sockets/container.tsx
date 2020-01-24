import React, { useEffect } from "react";
import { IotService } from "../../../common/utils/iot/mqttClient";
import ChangeRequestListSockets from "./ChangeRequestList";

const SocketsContainer: React.FunctionComponent = () => {
  useEffect(() => {
    return () => {
      const iotService = IotService.getInstance();
      iotService.unsubscribeAll();
    };
  }, []);

  return <ChangeRequestListSockets />;
};

export default SocketsContainer;
