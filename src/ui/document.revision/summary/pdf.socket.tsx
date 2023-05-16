import React, { useCallback, useMemo } from 'react';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import useActionCreator from '../../hooks/useActionCreator';
import useMqttSubscription from '../../hooks/useMqttSubscription';

interface Props {
  documentRevision: DocumentRevision;
}

const PDFSocket: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const { id: docRevId } = documentRevision;
  const setDocumentRevision = useActionCreator(documentRevisionsActions.documentRevisionSet);

  const callback = useCallback((response: { url: string }) => {
    const { url: pdf } = response;
    setDocumentRevision({
      ...documentRevision,
      pdf,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const topic = useMemo(() => `+/document_revisions/${docRevId}/pdf`, [docRevId]);

  useMqttSubscription(topic, callback);

  return null;
};

export default PDFSocket;
