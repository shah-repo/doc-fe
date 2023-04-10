import React, { ChangeEventHandler } from "react";
import { debounce } from "lodash";
import { Input } from "@material-ui/core";
import Filter from "../Filter";
import { GridFilterCellProps } from "@progress/kendo-react-grid";

const InputFilter: React.FC<GridFilterCellProps> = (props) => {
  const {
    value = "",
    operator = "contains",
    onChange,
  } = props;

  const handleChange: ChangeEventHandler<HTMLInputElement> = debounce(
    (event) => {
      const newValue = event.currentTarget.value;

      if (newValue === value) {
        return;
      }

      onChange({
        value: newValue,
        operator,
        syntheticEvent: event,
      });
    },
    500
  );

  return (
    <Filter>
      <Input
        defaultValue={value}
        onChange={handleChange}
      />
    </Filter>
  );
};

export default InputFilter;
