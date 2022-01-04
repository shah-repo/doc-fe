import {
  GridColumnMenuGroup,
  GridColumnMenuItem,
  GridColumnMenuProps,
} from "@progress/kendo-react-grid";
import { filter, find } from "lodash";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getTableCriteria } from "../../../../../common/utils/selectors";
import { tableSearchActions } from "../../../../../state/ducks/tableSearch";
import { DisplayText, TranslatedText } from "../../kendo/helpers";
import { KendoColumn } from "../../kendo/types";

interface CustomColumnMenuProps extends GridColumnMenuProps {
  columns: KendoColumn[];
  tableName: string;
}

export const ColumnMenu = (props: CustomColumnMenuProps) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [columns, setColumns] = useState<KendoColumn[]>(props.columns);
  const tableCriteria: any = useSelector(getTableCriteria(props.tableName));
  const onChange = (field: string | undefined) => {
    columns.forEach((c, i) => {
      if (c.field === field) {
        c.show = !c.show;
      }
      if (!filter(columns, "show").length) {
        columns[i].show = true;
      }
    });
    setColumns(columns);
    if (props.column.field === field) {
      const columnConfig = JSON.stringify(columns);
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            columnConfig,
          },
          props.tableName
        )
      );
    }
    if (props.onCloseMenu) {
      props.onCloseMenu();
    }
  };
  const columnDef = find(columns, { field: props.column.field });
  const [columnLock, setColumnLock] = useState<KendoColumn[]>(
    props.columns
  );
  const handleColumnLockToggle = (field) => {
    columnLock.forEach((c, i) => {
      if (c.field === field) {
        c.locked = !c.locked;
      }
    });
    setColumnLock(columnLock);
    if (props.column.field === field) {
      const columnConfig = JSON.stringify(columnLock);
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            columnConfig,
          },
          props.tableName
        )
      );
    }
    if (props.onCloseMenu) {
      props.onCloseMenu();
    }
  };

  return (
    <>
      {columnDef?.groupable && <GridColumnMenuGroup {...props} />}
      {!columnDef?.disabled && (
        <GridColumnMenuItem
          {...props}
          iconClass="k-i-preview .k-i-eye"
          onClick={() => onChange(props.column.field)}
          title={intl.formatMessage({
            id: TranslatedText[DisplayText.HIDE_COLUMN],
          })}
        />
      )}
      <GridColumnMenuItem
        {...props}
        iconClass={columnDef?.locked ? "k-icon k-i-unlock" : "k-icon k-i-lock"}
        onClick={() => handleColumnLockToggle(props.column.field)}
        title={
          columnDef?.locked
            ? intl.formatMessage({
              id: TranslatedText[DisplayText.UNLOCK_COLUMN],
            })
            : intl.formatMessage({
              id: TranslatedText[DisplayText.LOCK_COLUMN],
            })
        }
      />
    </>
  );
};
