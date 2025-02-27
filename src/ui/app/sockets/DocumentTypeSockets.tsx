import { throttle } from 'lodash';
import React, { useMemo } from 'react';
import { documentTypeActions } from '../../../state/ducks/documentRevisions/documentType';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useMqttSubscription from '../../hooks/useMqttSubscription';

const DOC_TYPE_FETCH_TIMEOUT = 2000;

const DocumentTypeSockets: React.FunctionComponent = () => {
  const loadAction = useActionCreator(documentTypeActions.loadList);
  const async = useAsync();

  const loadData = useMemo(
    () => throttle(
      () => {
        async.start(loadAction);
      },
      DOC_TYPE_FETCH_TIMEOUT,
      { leading: true, trailing: true },
    ),
    [async, loadAction],
  );

  useMqttSubscription('+/document_type/+/created', loadData);
  useMqttSubscription('+/document_type/+/updated', loadData);
  useMqttSubscription('+/document_type/+/deleted', loadData);
  useMqttSubscription('+/dam/+/release', loadData);
  return null;
};

export default DocumentTypeSockets;
