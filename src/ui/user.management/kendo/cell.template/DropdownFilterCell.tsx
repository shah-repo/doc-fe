import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import * as React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";

interface DropdownFilterCellProps extends GridFilterCellProps {
  defaultItem: string;
  data: string[];
}

export const DropdownFilterCell = (props: DropdownFilterCellProps) => {
  const intl = useIntl();
  const hasValue = (value: string) => value && value !== props.defaultItem;

  const onChange = (event: DropDownListChangeEvent) => {
    props.onChange({
      value: hasValue(event.target.value) ? event.target.value : "",
      operator: hasValue(event.target.value) ? "contains" : "",
      syntheticEvent: event.syntheticEvent,
    });
  };

  const onClearButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    props.onChange({
      value: "",
      operator: "",
      syntheticEvent: event,
    });
  };
  return (
    <div className="k-filtercell">
      <DropDownList
        data={props.data.filter((el) => el).sort()}
        onChange={onChange}
        value={props.value || props.defaultItem}
        defaultItem={props.defaultItem}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({ id: TranslatedText[DisplayText.CLEAR] })}
        disabled={!hasValue(props.value)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
