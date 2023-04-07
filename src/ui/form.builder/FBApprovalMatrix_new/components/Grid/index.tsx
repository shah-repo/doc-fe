import React from "react";
import { useTranslate } from "../../../../../common/intl";
import { AutoSizer } from "react-virtualized";
import KendoGlobalization from "../../../../components/KendoGlobalization";
import {
  Grid as KendoGrid,
  GridColumn as KendoColumn,
} from "@progress/kendo-react-grid";
import CheckboxCell from "../CheckboxCell";
import { GridProps } from "./types";
import { FBApprovalMatrixTableRoleHead as RoleStageTitles } from "../../../FBApprovalMatrixTable/FBApprovalMatrixTable.types";

// @todo: styles
// @todo: filters
// @todo: active BE
// @todo: translations
// @todo: fullscreen
// @todo: add new
// @todo: change and save

const Grid: React.FC<GridProps> = (props) => {
  const { data: { approvalMatrix = [], approvalRoles = [] } = {} } = props;

  const translate = useTranslate();

  return (
    <AutoSizer>
      {({ width }) => (
        <KendoGlobalization>
          <KendoGrid
            style={{ width: `${width}px` }}
            data={approvalMatrix}
          >
            <KendoColumn
              title="Status"
              field="docType.acronym"
              width={100}
              locked
            />
            <KendoColumn
              title="Prefix"
              field="docType.acronym"
              width={100}
              locked
            />
            <KendoColumn
              title="Internal type"
              field="docType.group"
              width={100}
              locked
            />
            <KendoColumn
              title="Document type"
              field="docType.name"
              width={100}
              locked
            />
            <KendoColumn
              cell={CheckboxCell}
              title="Training"
              field="docType.defaultTraining"
              width={100}
            />
            <KendoColumn
              cell={CheckboxCell}
              title="Signature"
              field="docType.needsSignature"
              width={100}
            />
            <KendoColumn
              title="Category"
              field="docType.category"
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
                    cell={CheckboxCell}
                    title={role.name}
                    field={`approvalRoles.${headKey}.${role.index}`}
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
