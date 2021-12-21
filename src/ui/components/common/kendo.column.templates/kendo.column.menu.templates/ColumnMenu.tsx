import {
  GridColumnMenuGroup,
  GridColumnMenuItem,
  GridColumnMenuProps,
} from "@progress/kendo-react-grid";
import { cloneDeep, find } from "lodash";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTableCriteria } from "../../../../../common/utils/selectors";
import { tableSearchActions } from "../../../../../state/ducks/tableSearch";
import { KendoColumn } from "../../kendo/types";

interface CustomColumnMenuProps extends GridColumnMenuProps {
  columns: KendoColumn[];
  tableName: string;
}

export const ColumnMenu = (props: CustomColumnMenuProps) => {
  const dispatch = useDispatch();
  const [columns, setColumns] = useState<KendoColumn[]>(props.columns);
  const tableCriteria: any = useSelector(getTableCriteria(props.tableName));
  const onChange = (field: string | undefined) => {
    const newState = [...columns];
    newState.forEach((c, i) => {
      if (c.field === field) {
        c.show = !c.show;
      }
    });
    setColumns(newState);
    if (props.column.field === field) {
      const columnConfig = JSON.stringify(cloneDeep(newState));
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
    const newState = [...columnLock];
    newState.forEach((c, i) => {
      if (c.field === field) {
        c.locked = !c.locked;
      }
    });
    setColumnLock(newState);
    if (props.column.field === field) {
      const columnConfig = JSON.stringify(cloneDeep(newState));
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
      <GridColumnMenuItem
        {...props}
        iconClass="k-i-preview .k-i-eye"
        onClick={() => onChange(props.column.field)}
        title="Hide Column"
      />
      <GridColumnMenuItem
        {...props}
        iconClass={columnDef?.locked ? "k-icon k-i-unlock" : "k-icon k-i-lock"}
        onClick={() => handleColumnLockToggle(props.column.field)}
        title={columnDef?.locked ? "Unlock Column" : "Lock Column"}
      />
    </>
  );
};
