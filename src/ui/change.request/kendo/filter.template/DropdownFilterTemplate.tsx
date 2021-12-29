import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import * as React from "react";

interface DropdownFilterTemplateProps extends GridFilterCellProps {
  defaultItem: string;
  defaultValue: string;
  data: any[];
  onStateChange?: (setDefault: boolean) => void;
}

export const DropdownFilterTemplate = (props: DropdownFilterTemplateProps) => {
  let hasValue: any = (value) => Boolean(value && value !== props.defaultItem);

  const onChange = (event: DropDownListChangeEvent) => {
    hasValue = hasValue(event.target.value);
    props.onChange({
      value: hasValue ? event.target.value : "",
      operator: hasValue ? "eq" : "",
      syntheticEvent: event.syntheticEvent,
    });
    if (event.target.value === "Select State") {
      props.onStateChange && props.onStateChange(true);
      return;
    }
    props.onStateChange && props.onStateChange(false);
  };

  const onClearButtonClick = (event) => {
    event.preventDefault();
    props.onChange({
      value: "",
      operator: "",
      syntheticEvent: event,
    });
    props.onStateChange && props.onStateChange(true);
  };
  return (
    <div className="k-filtercell">
      <DropDownList
        style={{ textTransform: "uppercase" }}
        data={props.data}
        onChange={onChange}
        value={props.value || props.defaultValue}
        defaultItem={props.defaultItem}
        defaultValue={props.defaultValue}
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
