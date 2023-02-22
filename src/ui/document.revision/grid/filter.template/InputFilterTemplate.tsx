import { Menu, MenuItem } from "@material-ui/core";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import { Input, InputChangeEvent } from "@progress/kendo-react-inputs";
import { debounce, isEmpty } from "lodash";
import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";

const valueOperators = [
  "contains",
  "doesnotcontain",
  "eq",
  "neq",
  "startswith",
  "endswith",
];

const soloOperators = [
  "isnull",
  "isnotnull",
  "isempty",
  "isnotempty",
];

const operatorsList = [...valueOperators, ...soloOperators];

export const InputFilterTemplate: React.FC<GridFilterCellProps> = ({
  value = "",
  operator = "contains",
  onChange,
}) => {
  const intl = useIntl();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isOpened, setIsOpened] = useState(false);
  const openMenu = () => setIsOpened(true);
  const closeMenu = () => setIsOpened(false);

  const updateFilter = ({
    event,
    newValue,
    newOperator,
  }: {
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

  const clearFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    updateFilter({ event, newValue: "", newOperator: "" });
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
      <button
        className="k-button k-button-icon k-clear-button-visible"
        onClick={openMenu}
        ref={buttonRef}
      >
        <span className="k-icon k-i-filter" />
      </button>
      <Menu
        anchorEl={buttonRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        getContentAnchorEl={null}
        keepMounted
        open={isOpened}
        onClose={closeMenu}
      >
        {operatorsList.map((newOperator) => (
          <MenuItem
            key={newOperator}
            value={newOperator}
            onClick={(event) => updateFilter({ event, newOperator })}
            selected={newOperator === operator}
          >
            {intl.formatMessage({ id: `dropdown.filter.${newOperator}` })}
          </MenuItem>
        ))}
      </Menu>
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({ id: TranslatedText[DisplayText.CLEAR] })}
        onClick={clearFilter}
        hidden={
          operator !== "contains" && operatorsList.includes(operator as string)
            ? false
            : isEmpty(value)
        }
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
