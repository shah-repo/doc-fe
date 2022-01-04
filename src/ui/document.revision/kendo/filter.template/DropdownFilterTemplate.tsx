import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import * as React from "react";

interface StateChangeProps {
  value?: string | null;
}
interface Props extends GridFilterCellProps {
  defaultItem: string;
  defaultValue: string;
  data: string[];
  onStateChange?: (setDefault: StateChangeProps) => void;
}

export const DropdownFilterTemplate = (props: Props) => {
  let hasValue: any = (value) => Boolean(value && value !== props.defaultItem);

  const onChange = (event: DropDownListChangeEvent) => {
    hasValue = hasValue(event.target.value);
    props.onChange({
      value: hasValue ? event.target.value : "",
      operator: hasValue ? "eq" : "",
      syntheticEvent: event.syntheticEvent,
    });
    props.onStateChange && props.onStateChange({
      value: hasValue ? event.target.value : "",
    });
  };

  const onClearButtonClick = (event) => {
    event.preventDefault();
    props.onChange({
      value: "",
      operator: "",
      syntheticEvent: event,
    });
    props.onStateChange && props.onStateChange({});
  };
  return (
    <div className="k-filtercell">
      <DropDownList
        data={props.data}
        onChange={onChange}
        value={(props.value || props.defaultValue)}
        defaultItem={props.defaultItem}
        defaultValue={props.defaultValue}
        style={{ textTransform: "uppercase" }}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title="Clear"
        disabled={!hasValue(props.value) && !hasValue(props.defaultValue)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
