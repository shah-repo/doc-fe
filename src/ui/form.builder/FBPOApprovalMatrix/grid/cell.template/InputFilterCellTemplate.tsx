import { GridFilterCellProps } from "@progress/kendo-react-grid";
import { Input, InputChangeEvent } from "@progress/kendo-react-inputs";
import { debounce, isEmpty } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../../components/common/kendo/helpers";
import { KendoGridFilterCellOperators } from "../../../../components/KendoGrid/interfaces";

export const InputFilterCellTemplate: React.FC<GridFilterCellProps> = ({
  value = "",
  operator = "contains",
  onChange,
}) => {
  const intl = useIntl();

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
  }, 1000);


  return (
    <div className="k-filtercell">
      <Input
        defaultValue={value}
        onChange={updateValue}
        style={{ width: "100%" }}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({ id: TranslatedText[DisplayText.CLEAR] })}
        onClick={clearFilter}
        hidden={
          operator === KendoGridFilterCellOperators.CONTAINS && isEmpty(value)
        }
        style={{ marginLeft: "5px" }}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
