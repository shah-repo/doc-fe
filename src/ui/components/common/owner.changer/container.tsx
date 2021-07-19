import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userManagementActions } from "../../../../state/ducks/userManagement";
import { GetEmployeeResponse } from "../../../../state/ducks/userManagement/types";
import { ApplicationState } from "../../../../state/reducers";
import { AsyncStatus } from "../../../../state/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { SelectOption } from "../../forms/fields/Select";
import { getUrlandActions } from "./helpers";
import { RequestType } from "./helpers/types";
import OwnerChangerPresenter from "./presenter";

interface OwnProps {
  requestId: string;
  requestType: RequestType;
}

const OwnerChangerContainer: React.FC<OwnProps> = ({
  requestId,
  requestType,
}) => {

  const dialog = useDialog();
  const openDialog = () => {
    if (getEmployees.asyncState.status === AsyncStatus.Idle) {
      getEmployees.start(getEmployeeAction, null, getEmployees);
    }
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
  const sortBy = (key) => (a, b) => {
    a = a[key].toLowerCase();
    b = b[key].toLowerCase();
    if ( a === b) { return 0; }
    return a < b ? -1 : 1;
  };

  const getEmployees = useAsync<GetEmployeeResponse[]>({
    onSuccess: (data: GetEmployeeResponse[] = []) => {
      const activeEmployees = data.filter((user) => user.active).map((employee) => ({
        value: employee.id,
        text: employee.user.name,
      }));
      setEmployees(activeEmployees.sort(sortBy("text")));
    },
  });


  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
