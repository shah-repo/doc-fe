import React, { useCallback, useMemo } from 'react';
import { appGlobals } from '../../appGlobals';
import { documentRevisionsActions } from '../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../state/ducks/documentRevisions/types';
import useActionCreator from '../hooks/useActionCreator';
import useAsync from '../hooks/useAsync';
import useMqttSubscription from '../hooks/useMqttSubscription';

interface Props {
  documentRevision: DocumentRevision
}

const DocumentRevisionUpdatedSubscriptions: React.FunctionComponent<Props> = ({
  documentRevision: {
    id,
  },
}) => {

  const loadAction = useActionCreator(documentRevisionsActions.load);
  const async = useAsync();

  const callback = useCallback(() => {
    if (appGlobals.omitReloadNotification) {
      appGlobals.omitReloadNotification = false;
      return;
    }
    async.start(loadAction, id, async);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topicAllSigned = useMemo(() => `+/hellosign_all_signed/${id}`, [id]);
  const topicTemplateCreated = useMemo(() => `+/hellosign_template_created/${id}`, [id]);
  const topicSignatureCanceled = useMemo(() => `+/hellosign_signature_canceled/${id}`, [id]);

  useMqttSubscription(topicAllSigned, callback);
  useMqttSubscription(topicTemplateCreated, callback);
  useMqttSubscription(topicSignatureCanceled, callback);

  return null;
};

export default DocumentRevisionUpdatedSubscriptions;
