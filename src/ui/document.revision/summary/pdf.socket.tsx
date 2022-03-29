import React from "react";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import useActionCreator from "../../hooks/useActionCreator";
import useMqttSubscription from "../../hooks/useMqttSubscription";

interface Props {
  documentRevision: DocumentRevision;
}

const PDFSocket: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const { id: docRevId } = documentRevision;
  const iotService = IotService.getInstance();

  const setDocumentRevision = useActionCreator(documentRevisionsActions.documentRevisionSet);

  const updatePdfLink = (response: { url: string }) => {
    const { url: pdf } = response;
    setDocumentRevision({
      ...documentRevision,
      pdf,
    });
  };

  const subscribe = () => {
    iotService.subscribeToTopic(`+/document_revisions/${docRevId}/pdf`, updatePdfLink);
  };

  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`+/document_revisions/${docRevId}/pdf`);
  };

  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default PDFSocket;
