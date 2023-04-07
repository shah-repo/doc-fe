import React from "react";
import { debounce } from "lodash";
import { Input, InputChangeEvent } from "@progress/kendo-react-inputs";
import { GridFilterCellProps } from "@progress/kendo-react-grid";

const InputFilterTemplate: React.FC<GridFilterCellProps> = (props) => {
  const {
    value = "",
    operator = "contains",
    onChange,
  } = props;

  const updateFilter = ({ event, newValue, newOperator }: {
    event: Parameters<GridFilterCellProps["onChange"]>[0]["syntheticEvent"];
    newValue?: GridFilterCellProps["value"];
    newOperator?: GridFilterCellProps["operator"];
  }) => {
    onChange({
      value: newValue ?? value,
      operator: newOperator ?? operator,
      syntheticEvent: event,
    });
  };

  const updateValue = debounce((e: InputChangeEvent) => {
    const newValue = e.target.value;
    if (newValue !== value) {
      updateFilter({ event: e.syntheticEvent, newValue });
    }
  }, 2000);

  return (
    <div className="k-filtercell">
      <Input
        defaultValue={value}
        onChange={updateValue}
        style={{ width: "100%", marginRight: "5px" }}
        data-cy="filter.value"
      />
    </div>
  );
};

export default InputFilterTemplate;
