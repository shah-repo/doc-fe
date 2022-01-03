/* eslint-disable no-console */
import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import * as React from "react";

interface DateDropdownFilterCellProps extends GridFilterCellProps {
  defaultItem: {
    text: string;
    value: string;
  };
  operator: string;
  data: {
    text: string;
    value: string;
  }[];
}

export const DateDropdownFilterCell = (props: DateDropdownFilterCellProps) => {
  let hasValue: any = (value) => Boolean(value && value !== props.defaultItem);
  const onChange = (event: DropDownListChangeEvent) => {
    hasValue = hasValue(event.target.value, "props.data ::", props.data);
    const selectedItem = props.data.find((dd) => dd.text === event.target.value.text);

    props.onChange({
      value: hasValue ? selectedItem?.value : "",
      operator: props.operator,
      syntheticEvent: event.syntheticEvent,
    });
  };

  const onClearButtonClick = (event) => {
    event.preventDefault();

    props.onChange({
      value: "",
      operator: "",
      syntheticEvent: event,
    });
  };
  const selectedItem = props.data.find((dd) => dd.value === props.value);
  return (
    <div className="k-filtercell">
      <DropDownList
        style={{ textTransform: "uppercase" }}
        data={props.data}
        textField="text"
        dataItemKey="value"
        onChange={onChange}
        value={selectedItem || props.defaultItem}
        defaultValue={selectedItem || props.defaultItem}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title="Clear"
        disabled={!hasValue(props.value)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
