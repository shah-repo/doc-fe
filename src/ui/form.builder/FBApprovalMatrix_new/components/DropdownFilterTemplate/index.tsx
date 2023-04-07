import React from "react";
import { DropDownList, DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";
import { DropdownFilterCellProps } from "./types";

export const DropdownFilterTemplate: React.FC<DropdownFilterCellProps> = (props) => {
  const {
    defaultItem, data, field, customOperator, value,
    onStateChange, onChange,
  } = props;

  const [state, setState] = React.useState({
    value: defaultItem,
  });

  const hasValue = (value: { text: string; value: string }) => value && value !== defaultItem;

  const onDropdownChange = ({ target, syntheticEvent }: DropDownListChangeEvent) => {
    const selectedItem = data.find((dd) => dd.text === target.value.text);
    const isValueExists = hasValue(target.value);
    setState({
      value: target.value,
    });
    onChange({
      value: isValueExists ? selectedItem?.value : "",
      operator: isValueExists ? customOperator || "eq" : "",
      syntheticEvent,
    });
    onStateChange && onStateChange({ selectedItem, parentField: field });
  };

  return (
    <div className="k-filtercell">
      <DropDownList
        data={data}
        textField="text"
        dataItemKey="value"
        onChange={onDropdownChange}
        defaultItem={defaultItem}
        defaultValue={state.value}
        value={data.find((dd) => dd.value === value) || defaultItem}
      />
    </div>
  );
};

export default DropdownFilterTemplate;
