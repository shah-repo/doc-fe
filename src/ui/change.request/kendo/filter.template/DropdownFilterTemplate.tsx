import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import * as React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";

interface DropdownFilterTemplateProps extends GridFilterCellProps {
  defaultItem: string;
  defaultValue: string;
  data: (string | number)[];
  onStateChange?: (setDefault: boolean) => void;
}

export const DropdownFilterTemplate: React.FunctionComponent<DropdownFilterTemplateProps> = ({
  onChange,
  defaultItem,
  onStateChange,
  data,
  defaultValue,
  value,
}) => {
  const intl = useIntl();
  let hasValue: any = (value) => Boolean(value && value !== defaultItem);

  const handleChange = (event: DropDownListChangeEvent) => {
    hasValue = hasValue(event.target.value);
    onChange({
      value: hasValue ? event.target.value : "",
      operator: hasValue ? "eq" : "",
      syntheticEvent: event.syntheticEvent,
    });
    if (
      event.target.value ===
      intl.formatMessage({ id: TranslatedText[DisplayText.SELECT_STATE] })
    ) {
      onStateChange && onStateChange(true);
      return;
    }
    onStateChange && onStateChange(false);
  };

  const onClearButtonClick = (event) => {
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
        style={{ textTransform: "uppercase" }}
        data={data}
        onChange={handleChange}
        value={value || defaultValue}
        defaultItem={defaultItem}
        defaultValue={defaultValue}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title="Clear"
        disabled={!hasValue(value)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
