import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import * as React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";

interface Props extends GridFilterCellProps {
  defaultItem: string;
  defaultValue: string;
  data: string[];
  onStateChange?: (setDefault: boolean) => void;
}

export const DropdownFilterTemplate = ({
  defaultItem,
  defaultValue,
  data,
  onStateChange,
  onChange,
  value,
}: Props) => {
  const hasValue = (value: string) => value && value !== defaultItem;
  const intl = useIntl();
  const onDropdownChange = ({ target, syntheticEvent }: DropDownListChangeEvent) => {
    const isValueExists = hasValue(target.value);
    onChange({
      value: isValueExists ? target.value : "",
      operator: isValueExists ? "eq" : "",
      syntheticEvent,
    });
    if (
      target.value ===
      intl.formatMessage({ id: TranslatedText[DisplayText.SELECT_STATE] })
    ) {
      onStateChange && onStateChange(true);
    } else {
      onStateChange && onStateChange(false);
    }
  };

  const onClearButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onChange({
      value: "",
      operator: "",
      syntheticEvent: event,
    });
    onStateChange && onStateChange(true);
  };
  return (
    <div className="k-filtercell">
      <DropDownList
        data={data}
        onChange={onDropdownChange}
        value={(value || defaultValue)}
        defaultItem={defaultItem}
        defaultValue={defaultValue}
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
