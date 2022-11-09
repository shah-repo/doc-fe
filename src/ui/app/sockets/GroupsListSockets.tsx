import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { companyActions } from "../../../state/ducks/company";
import { userManagementActions } from "../../../state/ducks/userManagement";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const GroupsListSockets: React.FunctionComponent = () => {
  const loadAction = useActionCreator(changeRequestsActions.loadAvailableApprovers);
  const getCompanyMine = useActionCreator(companyActions.getCompanyMine);
  const getCompanyGroups = useActionCreator(userManagementActions.loadCompanyGroups);
  const getUserGroups = useActionCreator(authActions.loadUserGroups);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const async = useAsync();

  const loadData = useCallback(() => {
    // load approvers
    async.start(loadAction);
    // load employees
    async.start(getCompanyMine, currentEmployeeId, async);
    // groups
    async.start(getCompanyGroups);
    // groups
    async.start(getUserGroups);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMqttSubscription(`+/group/+/created`, loadData);
  useMqttSubscription(`+/group/+/updated`, loadData);
  useMqttSubscription(`+/group/+/deleted`, loadData);

  return null;
};

export default GroupsListSockets;
