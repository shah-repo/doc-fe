import React from "react";
import { useTranslate } from "../../../../../common/intl";
import { AutoSizer } from "react-virtualized";
import KendoGlobalization from "../../../../components/KendoGlobalization";
import {
  Grid as KendoGrid,
  GridColumn as KendoColumn, GridFilterCellProps,
} from "@progress/kendo-react-grid";
import CheckboxCell from "../CheckboxCell";
import EmptyDashCell from "../EmptyDashCell";
import DropdownFilter from "../DropdownFilter";
import BooleanFilter from "../BooleanFilter";
import StatusFilter from "../BooleanFilter";
import InputFilter from "../InputFilter";
import { GridProps } from "./types";
import { FBApprovalMatrixTableRoleHead as RoleStageTitles } from "../../../FBApprovalMatrixTable/FBApprovalMatrixTable.types";

// @todo: active BE
// @todo: filters
// @todo: add new
// @todo: change and save
// @todo: translations
// @todo: styles
// @todo: fullscreen

const Grid: React.FC<GridProps> = (props) => {
  const { data: { approvalMatrix = [], approvalRoles = [] } = {} } = props;

  const translate = useTranslate();

  const uniqueCategories = Array.from(new Set(approvalMatrix.map((item) => item?.docType?.category).filter(Boolean)));

  const CategoryFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={
        uniqueCategories.map((category) => ({ value: category, text: category }))
      }
      defaultItem={{ value: "", text: translate("common.all") }}
    />
  );

  return (
    <AutoSizer>
      {({ width }) => (
        <KendoGlobalization>
          <KendoGrid
            style={{ width: `${width}px` }}
            data={approvalMatrix}
            filterable={true}
          >
            <KendoColumn
              title="Status"
              field="docType.acronym"
              filterable={true}
              filterCell={StatusFilter}
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
          </KendoGrid>
        </KendoGlobalization>
      )}
    </AutoSizer>
  );
};

export default Grid;
