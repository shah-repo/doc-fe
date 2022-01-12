/* eslint-disable no-console */
import {
  DropDownList, DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import * as React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../kendo/helpers";

interface DateDropdownFilterCellProps extends GridFilterCellProps {
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

export const DateDropdownFilterCell = ({
  defaultItem,
  data,
  field,
  onStateChange,
  defaultValue,
  onChange,
}: DateDropdownFilterCellProps) => {
  const intl = useIntl();
  const [state, setState] = React.useState({
    value: defaultItem,
  });
  let hasValue: any = (value) => Boolean(value && value !== defaultItem);
  const onDropdownChange = ({ target }: DropDownListChangeEvent) => {
    hasValue = hasValue(target.value, "props.data ::", data);
    const selectedItem = data?.find((dd) => dd.text === target.value.text);
    setState({
      value: target.value,
    });
    onStateChange && onStateChange({ selectedItem, parentField: field });
  };

  const onClearButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();

    onChange({
      value: "",
      operator: "",
      syntheticEvent: event,
    });

    setState({
      value: defaultItem,
    });

    onStateChange &&
      onStateChange({
        selectedItem: {
          text: intl.formatMessage({
            id: TranslatedText[DisplayText.SELECT_ITEM],
          }),
          value: "",
        },
        parentField: field,
      });
  };
  return (
    <div className="k-filtercell">
      <DropDownList
        style={{ textTransform: "uppercase" }}
        data={data}
        textField="text"
        dataItemKey="value"
        onChange={onDropdownChange}
        value={state.value}
        defaultValue={defaultValue}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({
          id: "common.clear",
        })}
        disabled={!hasValue(defaultItem?.value)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
