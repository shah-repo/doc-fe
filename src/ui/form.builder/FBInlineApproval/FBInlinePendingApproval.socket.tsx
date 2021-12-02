import React from "react";
import { FB } from "..";
import { IotService } from "../../../common/utils/iot/mqttClient";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBInlinePendingApprovalSocket: React.FunctionComponent<{}> = () => {
  const { workspaceState } = FB.useStores();
  const { id } = workspaceState || {};
  const iotService = IotService.getInstance();

  const subscribe = () => {
    iotService.subscribeToTopic(
      `+/record/${id}/refresh`,
      reload
    );
  };

  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(
      `+/record/${id}/refresh`,
    );
  };

  const reload = (resp: string) => {
    window.location.reload();
  };

  useMqttSubscription(subscribe, unsubscribe);
  return null;
};

export default FBInlinePendingApprovalSocket;
