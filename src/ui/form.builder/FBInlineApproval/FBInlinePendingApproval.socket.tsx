import React from "react";
import { FB } from "..";
import { IotService } from "../../../common/utils/iot/iotService";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBInlinePendingApprovalSocket: React.FunctionComponent<{}> = () => {
  const { workspaceState } = FB.useStores();
  const { id } = workspaceState || {};
  const iotService = IotService.getInstance();

  const subscribe = () => {
    iotService.subscribeToTopic(
      `+/document_revisions/${id}/inline_section/updated`,
      reload
    );
  };

  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(
      `+/document_revisions/${id}/inline_section/updated`,
    );
  };

  const reload = (resp: string) => {
    window.location.reload();
  };

  useMqttSubscription(subscribe, unsubscribe);
  return null;
};

export default FBInlinePendingApprovalSocket;
