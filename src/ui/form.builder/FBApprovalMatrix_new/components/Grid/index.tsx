import React, { useState } from "react";
import { useTranslate } from "../../../../../common/intl";
import { AutoSizer } from "react-virtualized";
import {
  GridColumn as KendoColumn,
  GridFilterCellProps,
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

// @todo: active BE
// @todo: add new
// @todo: change and save
// @todo: connect BE side
// @todo: translations
// @todo: styles
// @todo: sticky header
// @todo: refactoring
// @todo: generic component
// @todo: fullscreen

export const EDIT_FIELD = "inEdit";

const Grid: React.FC<GridProps> = (props) => {
  const { data: { approvalMatrix = [], approvalRoles = [] } = {} } = props;

  // @todo: remove mapping
  const [data, setData] = useState(approvalMatrix.map((item) => ({ ...item, active: true })));

  const translate = useTranslate();

  const uniqueCategories = Array.from(new Set(approvalMatrix.map((item) => item?.docType?.category).filter(Boolean)));

  const CategoryFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={uniqueCategories.map((category) => ({ value: category, text: category }))}
      defaultItem={{ value: "", text: translate("common.all") }}
    />
  );

  const handleRowClick = ({ dataItem }: GridRowClickEvent) => {
    const dataWithEditFlag = data.map((item) => {
      item[EDIT_FIELD] = item.id === dataItem.id;
      return item;
    });
    setData(dataWithEditFlag);
  };

  const handleItemChange = ({ dataItem }: GridItemChangeEvent) => {
    const dataWithChangedItem = data.map((item) => {
      if (item.id === dataItem.id) {
        return dataItem;
      }
      return item;
    });
    setData(dataWithChangedItem);
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

  return (
    <AutoSizer>
      {({ width }) => (
        <KendoDataGrid
          style={{ width: `${width}px` }}
          {...process(data, dataState)}
          onRowClick={handleRowClick}
          onItemChange={handleItemChange}
          onDataStateChange={handleDataStateChange}
          filterable={true}
          {...dataState}
        >
          <KendoColumn
            title="Status"
            field="active"
            filterable={true}
            filterCell={StatusFilter}
            cell={ActiveCell}
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
            cell={CheckboxCell}
            width={100}
          />
          <KendoColumn
            title="Signature"
            field="docType.needsSignature"
            filterable={true}
            filterCell={BooleanFilter}
            cell={CheckboxCell}
            width={100}
          />
          <KendoColumn
            title="Category"
            field="docType.category"
            filterable={true}
            filterCell={CategoryFilter}
            cell={EmptyDashCell}
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
                  cell={CheckboxCell}
                  width={50}
                />
              ))}
            </KendoColumn>
          ))}
        </KendoDataGrid>
      )}
    </AutoSizer>
  );
};

export default Grid;
