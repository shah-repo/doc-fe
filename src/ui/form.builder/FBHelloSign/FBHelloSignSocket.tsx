import React from "react";
import { IotService } from "../../../common/utils/iot/mqttClient";
import useMqttSubscription from "../../hooks/useMqttSubscription";
import FBStore from "../stores/ui/FBStore";

const FBHelloSignSocket: React.FunctionComponent = () => {
  const { docId } = FBStore;
  const iotService = IotService.getInstance();
  const notify = () => {
    console.log("NOTIFY");
  };
  const subscribe = () => {
    iotService.subscribeToTopic(`+/hellosign_all_signed/${docId}`, notify);
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`+/hellosign_all_signed/${docId}`);
  };
  useMqttSubscription(subscribe, unsubscribe);

  console.log("HERE");
  return null;
};

export default FBHelloSignSocket;
