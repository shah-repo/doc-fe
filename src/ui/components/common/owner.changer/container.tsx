import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  GetEmployeeResponse,
  userManagementActions,
} from "../../../../state/ducks/userManagement";
import { ApplicationState } from "../../../../state/reducers";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
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

  const dialog = useDialog();
  const openDialog = () => {
    getEmployees.reset();
    dialog.open();
  };

  const [employees, setEmployees] = useState<SelectOption[]>([]);
  const [action, selector] = getUrlandActions(requestType);
  const createdAction = useActionCreator(action);
  const current = useSelector((state: ApplicationState) =>
    selector(state, requestId),
  );
  const asyncUpdateOwner = useAsync({
    onSuccess: (response) => {
      dialog.close();
    },
  });

  const updateOwner = (values) => {
    const ownerData = {
      owner: {
        id: values.employee,
      },
    };
    asyncUpdateOwner.start(
      createdAction,
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
      isDialogOpen={dialog.isOpen}
      openDialog={openDialog}
      closeDialog={dialog.close}
    />
  );
};

export default OwnerChangerContainer;
