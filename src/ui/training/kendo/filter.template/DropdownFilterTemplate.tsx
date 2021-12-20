import { DropDownList } from "@progress/kendo-react-dropdowns";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import React from "react";

interface DropdownFilterTemplateProps extends GridFilterCellProps {
  defaultItem: {
    text: any;
    value: string;
  };
  defaultValue: {
    text: any;
    value: string;
  };
  operator: string;
  data: {
    text: string;
    value: string;
  }[];
  onStateChange?: any;
}

export const DropdownFilterTemplate = (props: DropdownFilterTemplateProps) => {
  const [state, setState] = React.useState({
    value: props.defaultItem,
  });
  let hasValue: any = (value) => Boolean(value && value !== props.defaultItem);
  const onChange = (event: any) => {
    hasValue = hasValue(event.target.value, "props.data ::", props.data);
    const selectedItem = props.data?.find(
      (dd) => dd.text === event.target.value.text
    );
    setState({
      value: event.target.value,
    });
    props.onStateChange &&
      props.onStateChange({ selectedItem, parentField: props.field });
  };

  const onClearButtonClick = (event) => {
    event.preventDefault();
    props.onChange({
      value: "",
      operator: "",
      syntheticEvent: event,
    });
    setState({
      value: props.defaultItem,
    });
    props.onStateChange &&
      props.onStateChange({
        selectedItem: {
          text: "Select Item",
          value: "",
        },
        parentField: props.field,
      });
  };

  return (
    <div className="k-filtercell">
      <DropDownList
        data={props.data}
        textField="text"
        dataItemKey="value"
        onChange={onChange}
        value={state.value}
        defaultValue={props.defaultValue}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title="Clear"
        disabled={!hasValue(props?.defaultItem?.value)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
