import React, { useCallback, useMemo } from 'react';
import { changeRequestsActions } from '../../state/ducks/changeRequest';
import { ChangeRequest } from '../../state/ducks/changeRequest/types';
import useActionCreator from '../hooks/useActionCreator';
import useAsync from '../hooks/useAsync';
import useMqttSubscription from '../hooks/useMqttSubscription';

interface Props {
  changeRequest: ChangeRequest;
}

const ChangeRequestSockets: React.FunctionComponent<Props> = ({
  changeRequest: {
    crId,
    id,
  },
}) => {
  const loadAction = useActionCreator(changeRequestsActions.load);
  const async = useAsync();

  const loadData = useCallback((msg: string) => {
    async.start(loadAction, id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const topic = useMemo(() =>  `+/change_requests/${crId}/updated`, [crId]);

  useMqttSubscription(topic, loadData);

  return null;
};

export default ChangeRequestSockets;
