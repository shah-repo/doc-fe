import React, { useEffect } from "react";
import { IotService } from "../../common/utils/iot/mqttClient";
import { dashboardActions } from "../../state/ducks/dashboard";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import useDidMqttConnect from "../hooks/useDidMqttConnect";

const TOPICS = [
  `+/training_records/+/created`,
  `+/training_records/+/updated`,
  `+/implementation_plan_task/+/created`,
  `+/implementation_plan_task/+/updated`,
];

const DashboardSockets: React.FunctionComponent = () => {
  const didMqttConnect = useDidMqttConnect();
  const iotService = IotService.getInstance();
  const subscribe = () => {
    if (didMqttConnect) {
      TOPICS.forEach((topic) => {
        iotService.subscribeToTopic(topic, loadData);
      });
    }
  };
  const unsubscribe = () => {
    TOPICS.forEach((topic) => {
      iotService.unsubscribeFromTopic(topic);
    });
  };
  const loadAction = useActionCreator(dashboardActions.loadPendingActionsList);
  const async = useAsync();
  const loadData = (msg: string) => {
    async.start(loadAction);
  };
  useEffect(() => {
    subscribe();
    return () => {
      // component will unsubscribe on unmount, no need for unsubscribeAll
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    subscribe();
    // WORKAROUND because we use unsubscribeAll in NavigationLinkContainer
  }, [didMqttConnect]);

  return null;
};

export default DashboardSockets;
