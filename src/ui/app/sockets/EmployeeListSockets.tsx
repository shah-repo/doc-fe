/* eslint-disable @typescript-eslint/quotes */
import React from "react";
import { useSelector } from "react-redux";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { authSelectors } from "../../../state/ducks/auth";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { companyActions } from "../../../state/ducks/company";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const TOPICS = [
  `+/employee/+/created`,
  `+/employee/+/updated`,
  `+/employee/+/deleted`,
];

const EmployeeListSockets: React.FunctionComponent = () => {
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
  const loadAction = useActionCreator(changeRequestsActions.loadAvailableApprovers);
  const getCompanyMine = useActionCreator(companyActions.getCompanyMine);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const async = useAsync();
  const loadData = () => {
    // load approvers
    async.start(loadAction);
    // load employees
    async.start(getCompanyMine, currentEmployeeId, async);
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default EmployeeListSockets;
