import React from "react";
import { IotService } from "../../../common/utils/iot/mqttClient";
import useMqttSubscription from "../../hooks/useMqttSubscription";
import FBStore from "../stores/ui/FBStore";

const FBHelloSignSocket: React.FunctionComponent = () => {
  const { docId, document } = FBStore;
  const iotService = IotService.getInstance();
  const notify = () => {
    console.log("NOTIFY");
  };
  const subscribe = () => {
    iotService.subscribeToTopic(`+/hellosign_all_signed/${docId}`, notify);
    iotService.subscribeToTopic(`hellosign_all_signed/${docId}`, notify);
    iotService.subscribeToTopic(`+/hellosign_all_signed/${document.document?.docId}`, notify);
    iotService.subscribeToTopic(`hellosign_all_signed/${document.document?.docId}`, notify);
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`+/hellosign_all_signed/${docId}`);
    iotService.unsubscribeFromTopic(`hellosign_all_signed/${docId}`);
    iotService.unsubscribeFromTopic(`+/hellosign_all_signed/${document.document?.docId}`);
    iotService.unsubscribeFromTopic(`hellosign_all_signed/${document.document?.docId}`);
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default FBHelloSignSocket;
