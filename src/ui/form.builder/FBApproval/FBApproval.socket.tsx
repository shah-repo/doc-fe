import { get, maxBy } from "lodash";
import { reaction } from "mobx";
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

  React.useEffect(() => reaction(
    () => approvalState?.getDocumentApi.data,
    (data) => {
      if (!documentId) { return; }
      const { documentRevisions } = data || {};
      const documentRevision = maxBy(documentRevisions, "version");
      if (!documentRevision) { return; }
      const { version: lastVersion = 0 } = documentRevision;
      const { version = 0 } = workspaceState?.document || {};
      if (lastVersion > version) {
        window.location.href = documentVersionPath(documentRevision.id, documentId);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

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
