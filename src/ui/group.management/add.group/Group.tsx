import { Dialog } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTableCriteria } from "../../../common/utils/selectors";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { GetEmployeeResponse, LoadCompanyGroup, userManagementActions } from "../../../state/ducks/userManagement";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import DialogTitle from "../dialog/DialogTitle";
import { DEFAULT_ACTIVE_EMPLOYEES } from "../utils/types";
import GroupContentContainer from "./GroupContent.container";

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
  const TABLE_NAME = "groupManagement";
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));

  const [activeEmployees, setActiveEmployees] = useState<GetEmployeeResponse[]>(
    DEFAULT_ACTIVE_EMPLOYEES,
  );
  const dispatch = useDispatch();
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

  const handleTableRefresh = () => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            groupName: "",
          },
        },
        TABLE_NAME,
      ),
    );
  };

  return (
    <Dialog fullScreen={true} open={isOpen}>
        <DialogTitle
            closeDialog={closeDialog}
            title={title}
        />
        <GroupContentContainer
          selectedGroup={selectedGroup}
          isCreateMode={isCreateMode}
          employees={activeEmployees}
          handleTableRefresh={handleTableRefresh}
          closeDialog={closeDialog}
        />
    </Dialog>
  );
};

export default AddGroup;
