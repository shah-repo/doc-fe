import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";

interface DropdownFilterCellProps extends GridFilterCellProps {
  defaultItem: {
    text: string;
    value: string;
  };
  data: {
    text: string;
    value: string;
  }[];
}

export const DropdownFilterCell = (props: DropdownFilterCellProps) => {
  const intl = useIntl();
  const [state, setState] = React.useState({
    value: props.defaultItem,
  });
  let hasValue: any = (value) => Boolean(value && value !== props.defaultItem);

  const onChange = (event: DropDownListChangeEvent) => {
    hasValue = hasValue(event.target.value, "props.data ::", props.data);
    const selectedItem = props.data.find((dd) => dd.text === event.target.value.text);
    setState({
      value: event.target.value,
    });
    // hasValue = hasValue(event.target.value);
    props.onChange({
      value: hasValue ? selectedItem?.value : "",
      operator: hasValue ? "eq" : "",
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
    setState({
      value: props.defaultItem,
    });
  };
  return (
    <div className="k-filtercell">
      <DropDownList
        data={props.data}
        textField="text"
        dataItemKey="value"
        onChange={onChange}
        defaultItem={props.defaultItem}
        defaultValue={state.value}
        value={props.data.find((dd) => dd.value === props.value) || props.defaultItem}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({ id: TranslatedText[DisplayText.CLEAR] })}
        onClick={onClearButtonClick}
        disabled={(props.value === "" || props.value === null)}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
