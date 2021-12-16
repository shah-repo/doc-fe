import { filterBy } from "@progress/kendo-data-query";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import Tooltip from "../../../components/common/kendo/Tooltip";
import { toMembersOptions } from "../../utils/transform";

export const EmployeesCell = (props) => {
  const employees = props.dataItem[props.field];
  const [result, setResult] = React.useState([]);
  const [data, setData] = React.useState(Object.keys(toMembersOptions(props.employees)).map(
    (key) => (Number(key), toMembersOptions(props.employees)[key])
  ).sort((a, b) => (a.label.trimLeft().trimEnd() > b.label.trimLeft().trimEnd()) ? 1 : -1));

  const updateMembersField = (event: any) => {
    props.dataItem.employees = event?.target?.value.map((item) => ({
      id: item?.value || "",
    }));
    setResult(event.target.value);
  };

  const filterChange = (event: any) => {
    const filter = event.filter;
    const allData = (Object.keys(toMembersOptions(props.employees)).map(
      (key) => (Number(key), toMembersOptions(props.employees)[key])
    )).slice();
    const newData = filterBy(allData, filter);
    setData(newData.sort((a, b) => (a.label.trimLeft().trimEnd() > b.label.trimLeft().trimEnd()) ? 1 : -1));
  };

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      {props.dataItem.inEdit ? (
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
        <Tooltip data={employees} />
      )}
    </td>
  );
};
