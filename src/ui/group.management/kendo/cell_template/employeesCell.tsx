import { Typography } from "@material-ui/core";
import { filterBy } from "@progress/kendo-data-query";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import Text from "../../../components/Text";
import { StyleTooltip } from "../../../dashboard.new/line.items/common/StyleTooltip";
import { toMembersOptions } from "../../utils/transform";

export const EmployeesCell = (props) => {
  const employees = props.dataItem[props.field];
  const [result, setResult] = React.useState([]);
  const [data, setData] = React.useState(Object.keys(toMembersOptions(props.employees)).map(
    (key) => (Number(key), toMembersOptions(props.employees)[key])
  ));

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
    setData(newData);
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
        <StyleTooltip title={<Typography><Text translation={employees} /></Typography>} placement="left-start" arrow>
          <span>{employees}</span>
        </StyleTooltip>
      )}
    </td>
  );
};
