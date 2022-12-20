import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { companyActions } from "../../../state/ducks/company";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useMqttSubscription from "../../hooks/useMqttSubscription";


const EmployeeListSockets: React.FunctionComponent = () => {

  const loadAction = useActionCreator(changeRequestsActions.loadAvailableApprovers);
  const getCompanyMine = useActionCreator(companyActions.getCompanyMine);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const async = useAsync();

  const callback = useCallback(() => {
    // load approvers
    async.start(loadAction);
    // load employees
    async.start(getCompanyMine, currentEmployeeId, async);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMqttSubscription(`+/employee/+/created`, callback);
  useMqttSubscription(`+/employee/+/updated`, callback);
  useMqttSubscription(`+/employee/+/deleted`, callback);

  return null;
};

export default EmployeeListSockets;
