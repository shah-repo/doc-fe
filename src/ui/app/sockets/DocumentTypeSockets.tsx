/* eslint-disable @typescript-eslint/quotes */
import React, { useCallback } from "react";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const DocumentTypeSockets: React.FunctionComponent = () => {
  const loadAction = useActionCreator(documentTypeActions.loadList);
  const async = useAsync();

  const loadData = useCallback(() => {
    async.start(loadAction);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMqttSubscription(`+/document_type/+/created`, loadData);
  useMqttSubscription(`+/document_type/+/updated`, loadData);
  useMqttSubscription(`+/document_type/+/deleted`, loadData);

  return null;
};

export default DocumentTypeSockets;
