import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { tableSearchActions } from '../../../state/ducks/tableSearch';
import { CR_TABLE_NAME } from '../../change.request/grid/container';
import useMqttSubscription from '../../hooks/useMqttSubscription';

const ChangeRequestListSockets: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const loadData = useCallback((msg: string, params: any) => {
    dispatch(
      tableSearchActions.setForceUpdate(
        CR_TABLE_NAME,
        true,
      ),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useMqttSubscription('+/change_requests/+/created', loadData);

  return null;
};

export default ChangeRequestListSockets;
