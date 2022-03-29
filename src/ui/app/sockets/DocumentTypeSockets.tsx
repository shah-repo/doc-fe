/* eslint-disable @typescript-eslint/quotes */
import React from "react";
import { IotService } from "../../../common/utils/iot/iotService";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const TOPICS = [
  `+/document_type/+/created`,
  `+/document_type/+/updated`,
  `+/document_type/+/deleted`,
];

const DocumentTypeSockets: React.FunctionComponent = () => {
  const iotService = IotService.getInstance();
  const subscribe = () => {
    TOPICS.forEach((topic) => {
      iotService.subscribeToTopic(topic, loadData);
    });
  };
  const unsubscribe = () => {
    TOPICS.forEach((topic) => {
      iotService.unsubscribeFromTopic(topic);
    });
  };
  const loadAction = useActionCreator(documentTypeActions.loadList);
  const async = useAsync();
  const loadData = () => {
    async.start(loadAction);
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default DocumentTypeSockets;
