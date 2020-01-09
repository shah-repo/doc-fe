import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  GetEmployeeResponse,
  userManagementActions,
} from "../../../../state/ducks/userManagement";
import { ApplicationState } from "../../../../state/reducers";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import { SelectOption } from "../../forms/fields/Select";
import { getUrlandActions } from "./helpers";
import OwnerChangerPresenter from "./presenter";

export interface OwnProps {
  requestId: string;
  requestType: string;
}

const OwnerChangerContainer: React.FC<OwnProps> = ({
  requestId,
  requestType,
}) => {
  const [employees, setEmployees] = useState<SelectOption[]>([]);
  const [action, selector] = getUrlandActions(requestType, requestId);
  const actionCreator = useActionCreator(action);
  const current = useSelector((state: ApplicationState) =>
    selector(state, requestId),
  );
  const asyncUpdateOwner = useAsync();

  const updateOwner = (ownerId) => {
    const ownerData = {
      owner: {
        id: ownerId,
      },
    };
    asyncUpdateOwner.start(
      actionCreator,
      requestId,
      ownerData,
      asyncUpdateOwner,
    );
  };

  const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);

  const getEmployees = useAsync<GetEmployeeResponse[]>({
    onSuccess: (data: GetEmployeeResponse[] = []) => {
      setEmployees(
        data.map((employee) => ({
          value: employee.id,
          text: employee.user.name,
        })),
      );
    },
  });

  useEffect(() => {
    getEmployees.start(getEmployeeAction, null, getEmployees);
  }, []);

  return (
    <OwnerChangerPresenter
      currentOwner={current.owner}
      employees={employees}
      updateOwner={updateOwner}
      asyncState={asyncUpdateOwner.asyncState}
    />
  );
};

export default OwnerChangerContainer;
