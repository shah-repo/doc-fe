import React, { useCallback } from 'react';
import { dashboardTodoActions } from '../../../state/ducks/dashboard.new/todo';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useMqttSubscription from '../../hooks/useMqttSubscription';

const DashboardTodoSockets: React.FunctionComponent = () => {
  const loadAction = useActionCreator(dashboardTodoActions.loadMyFeedsList);
  const async = useAsync();

  const loadData = useCallback(() => {
    async.start(loadAction);
  }, []);

  useMqttSubscription('+/dashboard_todo/+/updated', loadData);
  return null;
};

export default DashboardTodoSockets;
