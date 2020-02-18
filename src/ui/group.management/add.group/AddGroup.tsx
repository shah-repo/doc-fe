import { Dialog } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { GetEmployeeResponse, LoadCompanyGroup, userManagementActions } from "../../../state/ducks/userManagement";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import DialogTitle from "../dialog/DialogTitle";
import { DEFAULT_ACTIVE_EMPLOYEE } from "../utils/types";
import AddGroupContentContainer from "./AddGroupContent.container";

interface Props {
  isOpen: boolean;
  closeDialog: () => void;
  selectedGroup?: LoadCompanyGroup;
  title: any;
  isCreateMode?: boolean;
}

export const AddGroup: React.FunctionComponent<Props> = ({
  isOpen,
  closeDialog,
  selectedGroup,
  title,
  isCreateMode,
}) => {
  const [activeEmployees, setActiveEmployees] = useState<GetEmployeeResponse[]>(
    DEFAULT_ACTIVE_EMPLOYEE,
  );

  const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);
  const asyncGetActiveEmployees = useAsync<GetEmployeeResponse[]>({
    onSuccess: (data: GetEmployeeResponse[] = []) => {
      setActiveEmployees(data);
    },
  });

  useEffect(() => {
    asyncGetActiveEmployees.start(
      getEmployeeAction,
      { active: true },
      asyncGetActiveEmployees,
    );
  }, []);

  return (
    <Dialog fullScreen={true} open={isOpen}>
        <DialogTitle
            closeDialog={closeDialog}
            title={title}
        />
        <AddGroupContentContainer
          selectedGroup={selectedGroup}
          isCreateMode={isCreateMode}
          employees={activeEmployees}
        />
    </Dialog>
  );
};

export default AddGroup;
