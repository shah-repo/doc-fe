import {
  GridColumnMenuGroup,
  GridColumnMenuItem,
  GridColumnMenuProps,
} from "@progress/kendo-react-grid";
import { filter, find, findIndex } from "lodash";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getTableCriteria } from "../../../../common/utils/selectors";
import { tableSearchActions } from "../../../../state/ducks/tableSearch";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import { KendoColumn } from "../../../components/common/kendo/types";
import { toastError } from "../../../components/notifications";


interface CustomColumnMenuProps extends GridColumnMenuProps {
  columns: KendoColumn[];
  tableName: string;
}

export const ColumnMenu = (props: CustomColumnMenuProps) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const dispatch = useDispatch();
  const [columns, setColumns] = useState<KendoColumn[]>(props.columns);
  const tableCriteria = useSelector(getTableCriteria(props.tableName));
  const kendoConfig = tableCriteria.queryDict.dataState;
  const onChange = (field: string | undefined) => {
    const isGrouped = findIndex(kendoConfig.group, { field });
    if (isGrouped > -1) {
      toastError(getTranslatedText("common.no.hide"));
      return;
    }
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
        c.orderIndex = !c.locked ? i : c.orderIndex;
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
          iconClass="k-i-preview .k-i-eye k-grid-menu-icon"
          onClick={() => onChange(props.column.field)}
          title={getTranslatedText(TranslatedText[DisplayText.HIDE_COLUMN])}
        />
      )}
      <GridColumnMenuItem
        {...props}
        iconClass={`k-icon k-grid-menu-icon ${columnDef?.locked ? "k-i-unlock" : "k-i-lock"}`}
        onClick={() => handleColumnLockToggle(props.column.field)}
        title={
          columnDef?.locked
            ? getTranslatedText(TranslatedText[DisplayText.UNLOCK_COLUMN])
            : getTranslatedText(TranslatedText[DisplayText.LOCK_COLUMN])
        }
      />
    </>
  );
};
