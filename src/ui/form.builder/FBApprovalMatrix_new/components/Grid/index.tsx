import React, { useState } from "react";
import { useTranslate } from "../../../../../common/intl";
import { AutoSizer } from "react-virtualized";
import {
  GridColumn as KendoColumn,
  GridFilterCellProps,
  GridRowProps,
  GridRowClickEvent,
  GridItemChangeEvent,
  GridDataStateChangeEvent,
} from "@progress/kendo-react-grid";
import KendoDataGrid from "../../../../components/KendoDataGrid/KendoDataGrid";
import CheckboxCell from "../CheckboxCell";
import EmptyDashCell from "../EmptyDashCell";
import ActiveCell from "../ActiveCell";
import DropdownFilter from "../DropdownFilter";
import BooleanFilter from "../BooleanFilter";
import StatusFilter from "../StatusFilter";
import InputFilter from "../InputFilter";
import { GridProps } from "./types";
import { FBApprovalMatrixTableRoleHead as RoleStageTitles } from "../../../FBApprovalMatrixTable/FBApprovalMatrixTable.types";
import { process, State } from "@progress/kendo-data-query";
import cx from "classnames";
import useStyles from "./styles";

// @todo: add new
// @todo: change and save
// @todo: connect BE side
// @todo: translations
// @todo: styles
// @todo: sticky header
// @todo: refactoring
// @todo: generic component
// @todo: fullscreen
// @todo: context for schema

export const MODE_FIELD = "_mode";
export enum Mode {
  show = "show",
  add = "add",
  edit = "edit",
}

const Grid: React.FC<GridProps> = (props) => {
  const { data: { approvalMatrix = [], approvalRoles = [] } = {} } = props;
  const classes = useStyles();

  const [data, setData] = useState(approvalMatrix);

  const translate = useTranslate();

  const uniqueCategories = Array.from(new Set(approvalMatrix.map((item) => item?.docType?.category).filter(Boolean)));

  const CategoryFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={uniqueCategories.map((category) => ({ value: category, text: category }))}
      defaultItem={{ value: "", text: translate("common.all") }}
    />
  );

  const handleAdd: React.MouseEventHandler = () => {
    setData((data) => [...data, { [MODE_FIELD]: Mode.add } as any]);
  };

  const handleRowClick = ({ dataItem }: GridRowClickEvent) => {
    setData((data) => data.map((item) => {
      const isAdd = item[MODE_FIELD] === Mode.add;

      if (item.id !== dataItem.id) {
        return {
          ...item,
          [MODE_FIELD]: !isAdd ? Mode.show : item[MODE_FIELD],
        };
      }

      return ({
        ...item,
        [MODE_FIELD]: !isAdd ? Mode.edit : item[MODE_FIELD],
      });
    }));
  };

  const handleItemChange = ({ dataItem }: GridItemChangeEvent) => {
    setData((data) => data.map((item) => {
      if (item.id !== dataItem.id) {
        return item;
      }

      return dataItem;
    }));
  };

  const [dataState, setDataState] = useState<State>({});

  const handleDataStateChange = ({ dataState }: GridDataStateChangeEvent) => {
    // Remove empty filters.
    if (dataState.filter?.filters) {
      dataState.filter.filters =  dataState.filter.filters
        .filter((item) => {
          if ("value" in item) {
            return item.value !== "";
          }

          return true;
        });
    }

    setDataState(dataState);
  };

  const rowRender = (row: React.ReactElement<HTMLTableRowElement>, props: GridRowProps) => {
    const { dataItem } = props;

    const isUpdating = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

    if (!isUpdating) {
      return row;
    }

    const styledRow = React.cloneElement(
      row,
      {
        ...row.props,
        className: cx(row.props.className, classes.updating),
      },
      row.props.children,
    );

    return (
      <>
        {styledRow}
        <div className={classes.save}>Save</div>
        <div className={classes.discard}>Discard</div>
      </>
    );
  };

  return (
    <>
      <div onClick={handleAdd}>Button</div>
      <AutoSizer>
        {({ width }) => (
          <KendoDataGrid
            style={{ width: `${width}px` }}
            {...process(data, dataState)}
            rowRender={rowRender}
            onRowClick={handleRowClick}
            onItemChange={handleItemChange}
            onDataStateChange={handleDataStateChange}
            filterable={true}
            {...dataState}
          >
            <KendoColumn
              title="Status"
              field="docType.active"
              filterable={true}
              filterCell={StatusFilter}
              cell={(props) => <ActiveCell {...props} editable={false} />}
              locked={true}
              width={100}
            />
            <KendoColumn
              title="Prefix"
              field="docType.acronym"
              filterable={true}
              filterCell={InputFilter}
              locked={true}
              width={100}
            />
            <KendoColumn
              title="Internal type"
              field="docType.group"
              filterable={true}
              filterCell={InputFilter}
              locked={true}
              width={100}
            />
            <KendoColumn
              title="Document type"
              field="docType.name"
              filterable={true}
              filterCell={InputFilter}
              locked={true}
              width={100}
            />
            <KendoColumn
              title="Training"
              field="docType.defaultTraining"
              filterable={true}
              filterCell={BooleanFilter}
              cell={(props) => <CheckboxCell {...props} editable={true} />}
              width={100}
            />
            <KendoColumn
              title="Signature"
              field="docType.needsSignature"
              filterable={true}
              filterCell={BooleanFilter}
              cell={(props) => <CheckboxCell {...props} editable={true} />}
              width={100}
            />
            <KendoColumn
              title="Category"
              field="docType.category"
              filterable={true}
              filterCell={CategoryFilter}
              cell={(props) => <EmptyDashCell {...props} editable={false} />}
              width={100}
            />
            {approvalRoles && Object.entries(RoleStageTitles).map(([headKey, headTitle]) => (
              <KendoColumn
                key={headKey}
                title={translate(headTitle)}
              >
                {approvalRoles.map((role) => (
                  <KendoColumn
                    key={headKey + role.name}
                    title={role.name}
                    field={`approvalRoles.${headKey}.${role.index}`}
                    filterable={false}
                    cell={(props) => <CheckboxCell {...props} editable={true} />}
                    width={50}
                  />
                ))}
              </KendoColumn>
            ))}
          </KendoDataGrid>
        )}
      </AutoSizer>
    </>
  );
};

export default Grid;
