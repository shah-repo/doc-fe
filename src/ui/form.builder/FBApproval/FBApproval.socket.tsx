import { get, last } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBApprovalSocketProps, FBApprovalState, FBFieldName } from "..";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { documentVersionPath } from "../../document.revision/utils/paths";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBApprovalSocket: React.FunctionComponent<FBApprovalSocketProps> = ({
  name,
}) => {
  const { workspaceState } = FB.useStores();
  const { id, documentId } = workspaceState || {};
  const approvalState: FBApprovalState = get(FB.useStores(), `${FBFieldName.ApprovalState}-${name}`);
  const iotService = IotService.getInstance();

  useObserver(() => {
    if (!documentId) { return; }
    const { documentRevisions } = approvalState?.getDocumentApi.data || {};
    const documentRevision = last(documentRevisions);
    if (!documentRevision) { return; }
    window.location.href = documentVersionPath(documentRevision.id, documentId);
  });

  const subscribe = () => {
    iotService.subscribeToTopic(
      `+/document_revisions/${id}/updated`,
      reload
    );
  };

  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(
      `+/document_revisions/${id}/updated`,
    );
  };

  const reload = (resp: string) => {
    approvalState?.getDocument(documentId);
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default FBApprovalSocket;
