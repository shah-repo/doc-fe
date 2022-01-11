import { filterBy } from "@progress/kendo-data-query";
import { MultiSelect, MultiSelectFilterChangeEvent } from "@progress/kendo-react-dropdowns";
import React from "react";
import { GetEmployeeResponse, LoadCompanyGroup } from "../../../../state/ducks/userManagement/types";
import Tooltip from "../../../components/common/kendo/Tooltip";
import { toMembersOptions } from "../../utils/transform";

interface LoadMemberGroupExt extends LoadCompanyGroup {
  memberNames: string;
}

interface EmployeeCellProps {
  dataItem: LoadMemberGroupExt;
  rowType?: string;
  colSpan?: number | undefined;
  style?: any;
  className?: string;
  columnIndex?: number;
  employees: GetEmployeeResponse[];
  field?: string;
}

export const EmployeesCell = ({
  dataItem,
  employees,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  field,
}: EmployeeCellProps) => {
  const employeesData = dataItem[field || ""];
  const [result, setResult] = React.useState([]);
  const [data, setData] = React.useState(Object.keys(toMembersOptions(employees)).map(
    (key) => (Number(key), toMembersOptions(employees)[key])
  ).sort((a, b) => (a.label.trimLeft().trimEnd() > b.label.trimLeft().trimEnd()) ? 1 : -1));

  const updateMembersField = ({ target }: any) => {
    dataItem.employees = target?.value.map((item: { value: string }) => ({
      id: item?.value || "",
    }));
    setResult(target.value);
  };

  const filterChange = (event: MultiSelectFilterChangeEvent) => {
    const filter = event.filter;
    const allData = (Object.keys(toMembersOptions(employees)).map(
      (key) => (Number(key), toMembersOptions(employees)[key])
    )).slice();
    const newData = filterBy(allData, filter);
    setData(newData.sort((a, b) => (a.label.trimLeft().trimEnd() > b.label.trimLeft().trimEnd()) ? 1 : -1));
  };

  if (rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {dataItem.inEdit ? (
        <MultiSelect
          data={data}
          value={result}
          filterable={true}
          onChange={updateMembersField}
          onFilterChange={filterChange}
          dataItemKey="value"
          textField="label"
        />
      ) : (
        <Tooltip data={employeesData} />
      )}
    </td>
  );
};
