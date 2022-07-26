import React, { useState } from "react";
import { useSelector } from "react-redux";
import { companySelectors } from "../../../../state/ducks/company";
import { ApplicationState } from "../../../../state/reducers";
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
  renderAsButton: boolean;
}

const OwnerChangerContainer: React.FC<OwnProps> = ({
  requestId,
  requestType,
  renderAsButton,
}) => {

  const dialog = useDialog();
  const companyEmployes = useSelector(companySelectors.getActiveEmployees);
  const openDialog = () => {
    const activeEmployees = companyEmployes.map((employee) => ({
      value: employee.id as string,
      text: employee.user?.name || "",
    }));
    setEmployees(activeEmployees);
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

  return (
    <OwnerChangerPresenter
      currentOwner={current.owner}
      employees={employees}
      updateOwner={updateOwner}
      asyncState={asyncUpdateOwner.asyncState}
      isDialogOpen={dialog.isOpen}
      openDialog={openDialog}
      closeDialog={dialog.close}
      renderAsButton={renderAsButton}
    />
  );
};

export default OwnerChangerContainer;
