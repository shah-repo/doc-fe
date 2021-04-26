import React from "react";
import { appGlobals } from "../../appGlobals";
import { IotService } from "../../common/utils/iot/mqttClient";
import { documentRevisionsActions } from "../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../state/ducks/documentRevisions/types";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import useMqttSubscription from "../hooks/useMqttSubscription";

interface Props {
  documentRevision: DocumentRevision;
}

const DocumentRevisionUpdatedSubscriptions: React.FunctionComponent<Props> = ({
  documentRevision: {
    id,
  },
}) => {
  const iotService = IotService.getInstance();
  const subscribe = () => {
    iotService.subscribeToTopic(`+/hellosign_all_signed/${id}`, loadData);
    iotService.subscribeToTopic(`+/document_revisions/${id}/updated`, loadData);
    iotService.subscribeToTopic(`+/hellosign_template_created/${id}`, loadData);
    iotService.subscribeToTopic(`+/hellosign_signature_canceled/${id}`, loadData);
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`+/hellosign_all_signed/${id}`);
    iotService.unsubscribeFromTopic(`+/document_revisions/${id}/updated`);
    iotService.unsubscribeFromTopic(`+/hellosign_template_created/${id}`);
    iotService.unsubscribeFromTopic(`+/hellosign_signature_canceled/${id}`);
  };
  const loadAction = useActionCreator(documentRevisionsActions.load);
  const async = useAsync();
  const loadData = (msg: string) => {
    if (appGlobals.omitReloadNotification) {
      appGlobals.omitReloadNotification = false;
      return;
    }
    async.start(loadAction, id, async);
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default DocumentRevisionUpdatedSubscriptions;
