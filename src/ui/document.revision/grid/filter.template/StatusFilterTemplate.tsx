import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import * as React from "react";
import { useIntl } from "react-intl";
import { ChangeRequestStatus } from "../../../../state/ducks/changeRequest/types";
import { DocumentCategory, DocumentRevisionStatus, DocumentRevisionStatusDisplay, POStatusLabelMapping } from "../../../../state/ducks/documentRevisions/types";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";

interface Props extends GridFilterCellProps {
  defaultItem: string;
  data: DocumentRevisionStatus[] | ChangeRequestStatus[] | POStatusLabelMapping[];
  documentTypeCategory?: string;
}

export const StatusFilterTemplate = ({
  defaultItem,
  data,
  onChange,
  value,
  documentTypeCategory,
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
  };

  const onClearButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onChange({
      value: "",
      operator: "",
      syntheticEvent: event,
    });
  };
  return (
    <div className="k-filtercell">
      <DropDownList
        data={data}
        onChange={onDropdownChange}
        value={value || defaultItem}
        defaultItem={defaultItem}
        itemRender={(li, itemProps) => { const itemChildren = <span>{(documentTypeCategory ===
          DocumentCategory.PurchaseOrder &&
           itemProps?.dataItem === DocumentRevisionStatusDisplay.Released ) ?
          DocumentRevisionStatusDisplay.Approved
          : li.props.children}</span>;
        return React.cloneElement(li, li.props, itemChildren); }}
        valueRender={(li, itemProps) => { const itemChildren = <span>{(documentTypeCategory ===
          DocumentCategory.PurchaseOrder && itemProps
          === DocumentRevisionStatusDisplay.Released ) ?
          DocumentRevisionStatusDisplay.Approved : li.props.children}</span>;
        return React.cloneElement(li, li.props, itemChildren); }}
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
