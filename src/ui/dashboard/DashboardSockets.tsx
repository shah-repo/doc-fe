/* eslint-disable @typescript-eslint/quotes */
import React from "react";
import { IotService } from "../../common/utils/iot/mqttClient";
import { dashboardActions } from "../../state/ducks/dashboard";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import useMqttSubscription from "../hooks/useMqttSubscription";

const TOPICS = [
  `+/training_records/+/created`,
  `+/training_records/+/updated`,
  `+/implementation_plan_task/+/created`,
  `+/implementation_plan_task/+/updated`,
];

const DashboardSockets: React.FunctionComponent = () => {
  const iotService = IotService.getInstance();
  const subscribe = () => {
    TOPICS.forEach((topic) => {
      iotService.subscribeToTopic(topic, loadData);
    });
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
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default DashboardSockets;
