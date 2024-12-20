import { throttle } from 'lodash';
import React, { useCallback } from 'react';
import { documentTypeActions } from '../../../state/ducks/documentRevisions/documentType';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useMqttSubscription from '../../hooks/useMqttSubscription';

const DocumentTypeSockets: React.FunctionComponent = () => {
  const loadAction = useActionCreator(documentTypeActions.loadList);
  const async = useAsync();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadData = useCallback(
    throttle(() => {
      async.start(loadAction);
    }, 2000, { leading: false, trailing: true }),
    [async, loadAction],
  );

  useMqttSubscription('+/document_type/+/created', loadData);
  useMqttSubscription('+/document_type/+/updated', loadData);
  useMqttSubscription('+/document_type/+/deleted', loadData);

  return null;
};

export default DocumentTypeSockets;
