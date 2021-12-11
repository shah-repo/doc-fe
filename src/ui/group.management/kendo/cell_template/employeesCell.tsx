/* eslint-disable no-console */
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React, { useEffect, useState } from "react";
import { userManagementActions } from "../../../../state/ducks/userManagement";
import { GetEmployeeResponse } from "../../../../state/ducks/userManagement/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import { toMembersOptions } from "../../utils/transform";
import { DEFAULT_ACTIVE_EMPLOYEES } from "../../utils/types";

export const EmployeesCell = (props) => {
  const employee = props.dataItem[props.field]?.map((emp) => emp.user.name);
  const [activeEmployees, setActiveEmployees] = useState<GetEmployeeResponse[]>(
    DEFAULT_ACTIVE_EMPLOYEES,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log("activeEmployeesCell", toMembersOptions(activeEmployees));

  const updateMembersField = (event: any) => {
    props.dataItem.employee = event?.target?.value;
  };
  return (<>
    {props.dataItem.inEdit && <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      <MultiSelect data={(toMembersOptions(activeEmployees)).map((e) => e.label)} filterable={true} onChange={updateMembersField} />
    </td>}
    {!props.dataItem.inEdit && <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      {employee}
    </td>}
  </>
  );
};
