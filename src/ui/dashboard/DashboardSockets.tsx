import React, { useCallback } from "react";
import { dashboardActions } from "../../state/ducks/dashboard";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import useMqttSubscription from "../hooks/useMqttSubscription";

const DashboardSockets: React.FunctionComponent = () => {
  const loadAction = useActionCreator(dashboardActions.loadPendingActionsList);
  const async = useAsync();
  const callback = useCallback(() => {
    async.start(loadAction);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMqttSubscription(`+/training_records/+/created`, callback);
  useMqttSubscription(`+/training_records/+/updated`, callback);
  useMqttSubscription(`+/implementation_plan_task/+/created`, callback);
  useMqttSubscription(`+/implementation_plan_task/+/updated`, callback);

  return null;
};

export default DashboardSockets;
