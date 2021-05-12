import React from "react";
import { FB, FBWorkspaceSocketProps } from "..";
import { IotService } from "../../../common/utils/iot/mqttClient";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBWorkspaceSocket: React.FunctionComponent<FBWorkspaceSocketProps> = ({
  id,
}) => {
  const { workspaceState } = FB.useStores();
  const iotService = IotService.getInstance();
  const subscribe = () => {
    setTimeout(() => {
      iotService.subscribeToTopic(
        `+/document_revisions/${id}/updated`,
        notify
      );
    }, 1000);
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(
      `+/document_revisions/${id}/updated`,
    );
  };
  const notify = (_msg: any) => {
    workspaceState?.loadDocRev();
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default FBWorkspaceSocket;
