/* eslint-disable @typescript-eslint/quotes */
import React from "react";
import { useSelector } from "react-redux";
import { IotService } from "../../../common/utils/iot/iotService";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { companyActions } from "../../../state/ducks/company";
import { userManagementActions } from "../../../state/ducks/userManagement";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const TOPICS = [
  `+/group/+/created`,
  `+/group/+/updated`,
  `+/group/+/deleted`,
];

const GroupsListSockets: React.FunctionComponent = () => {
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
  const getCompanyGroups = useActionCreator(userManagementActions.loadCompanyGroups);
  const getUserGroups = useActionCreator(authActions.loadUserGroups);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const async = useAsync();
  const loadData = () => {
    // load approvers
    async.start(loadAction);
    // load employees
    async.start(getCompanyMine, currentEmployeeId, async);
    // groups
    async.start(getCompanyGroups);
    // groups
    async.start(getUserGroups);
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default GroupsListSockets;
