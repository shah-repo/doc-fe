import React from "react";
import { FB } from "..";
import { IotService } from "../../../common/utils/iot/mqttClient";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBWorkspaceSocket: React.FunctionComponent<{}> = () => {
  const { workspaceState } = FB.useStores();
  const { id } = workspaceState || {};
  const iotService = IotService.getInstance();
  const subscribe = () => {
    if (!id) { return; }
    iotService.subscribeToTopic(
      `+/document_revisions/${id}/fieldLock/created`, loadLockedFields
    );
    iotService.subscribeToTopic(
      `+/document_revisions/${id}/fieldLock/refreshed`, loadLockedFields
    );
    iotService.subscribeToTopic(
      `+/document_revisions/${id}/fieldLock/expired`, loadLockedFields
    );
    iotService.subscribeToTopic(
      `+/document_revisions/${id}/updated`, loadDocumentRevision
    );
  };
  const unsubscribe = () => {
    if (!id) { return; }
    iotService.unsubscribeFromTopic(
      `+/document_revisions/${id}/fieldLock/created`,
    );
    iotService.unsubscribeFromTopic(
      `+/document_revisions/${id}/fieldLock/refreshed`,
    );
    iotService.unsubscribeFromTopic(
      `+/document_revisions/${id}/fieldLock/expired`,
    );
    iotService.unsubscribeFromTopic(
      `+/document_revisions/${id}/updated`,
    );
  };

  const loadLockedFields = () => {
    // SMStore.get<FBLockBody, null>({
    //   url: SMStore.templateUrl(SMUrl.lockedFields, { id }),
    // });
  };

  const loadDocumentRevision = () => {
    // workspaceState?.loadDocRev();
  };

  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default FBWorkspaceSocket;
