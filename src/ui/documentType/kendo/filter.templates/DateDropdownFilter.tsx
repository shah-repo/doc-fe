/* eslint-disable no-console */
import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import * as React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";

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

export const DateDropdownFilterCell = ({
  defaultItem,
  data,
  onChange,
  value,
  operator,
}: DateDropdownFilterCellProps) => {
  const intl = useIntl();
  const hasValue = (value: { text: string; value: string }) => value && value !== defaultItem;
  const onDropdownChange = ({ target, syntheticEvent }: DropDownListChangeEvent) => {
    const isValueExists = hasValue(target.value);
    const selectedItem = data.find((dd) => dd.text === target.value.text);
    onChange({
      value: isValueExists ? selectedItem?.value : "",
      operator,
      syntheticEvent,
    });
  };

  const onClearButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();

    onChange({
      value: "",
      operator: "",
      syntheticEvent: event,
    });
  };
  const selectedItem = data.find((dd) => dd.value === value);
  return (
    <div className="k-filtercell">
      <DropDownList
        data={data}
        textField="text"
        dataItemKey="value"
        onChange={onDropdownChange}
        value={selectedItem || defaultItem}
        defaultValue={selectedItem || defaultItem}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({ id: TranslatedText[DisplayText.CLEAR] })}
        disabled={!hasValue(value)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
