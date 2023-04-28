import { process, State } from "@progress/kendo-data-query";
import { setGroupIds } from "@progress/kendo-react-data-tools";
import { Grid as KendoGrid, GridColumn, GridColumnMenuGroup, GridColumnReorderEvent, GridDataStateChangeEvent, GridFilterCellProps, GridNoRecords } from "@progress/kendo-react-grid";
import { find, findIndex, map, sortBy, startCase } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { AutoSizer, Size } from "react-virtualized";
import { Group } from "../../../../state/ducks/auth/types";
import { Employee } from "../../../../state/ducks/company/types";
import { Default } from "../../../components/common/kendo.column.templates/Default";
import ColumnHeader from "../../../components/common/kendo/ColumnHeader";
import { setColumnWidth } from "../../../components/common/kendo/helpers";
import NoDataFound from "../../../components/common/kendo/NoDataFound";
import { CustomGridCellProps, KendoColumn } from "../../../components/common/kendo/types";
import KendoGlobalization from "../../../components/KendoGlobalization";
import { POApprovalMatrixLevel, Signature } from "../FBPOApprovalMatrix.types";
import { InputFilterCellTemplate } from "./cell.template/InputFilterCellTemplate";
import { SignatureCellTemplate } from "./cell.template/SignatureCellTemplate";
import gridConfiguration from "./column.definition";
import useStyles from "./FBPOAMKendoTable.styles";

interface KendoTableProps {
  approvalLevels: POApprovalMatrixLevel[];
  handleEdit: (index: number, item: POApprovalMatrixLevel) => void;
  groups?: Map<string, Group>;
  employees?: Map<string, Employee>;
}

const FBPOAMKendoTable: React.FunctionComponent<KendoTableProps> = ({
  approvalLevels,
  employees,
  groups,
  handleEdit,
}) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : "";
  const classes = useStyles();
  const [columnDefinitions, setColumnDefinitions] = useState<KendoColumn[]>(
    gridConfiguration.columns
  );

  const data = useMemo(() => approvalLevels?.map((ele) => ({
    ...ele, signatures: (ele.signatures as Signature[]).reduce((prevVal, currentVal) => {

      const groupNames = currentVal?.groups?.map((group) => groups?.get(group.id)?.name);
      const employeeNames = currentVal?.employees?.map((employee) => employees?.get(employee.id)?.user?.name);
      return {
        ...prevVal,
        [`signatureStage${currentVal?.signatureStage}`]: JSON.stringify([...groupNames, ...employeeNames]),
      };
    }, {}),
  })), [approvalLevels, groups, employees ]);

  const fieldToCellMapping = {
    signatures: SignatureCellTemplate,
  };

  const processWithGroups = (data, dataState: State) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };

  const [dataState, setDataState] = useState<State>({
    filter:
      {
        logic: "and",
        filters: [],
      },
    group: [],
    sort: [],
  });

  const onDataStateChange = useCallback(
    ({ dataState }: GridDataStateChangeEvent) => {
      setDataState(dataState);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [approvalLevels]
  );

  const resultState = useMemo(() => processWithGroups(data, dataState), [data, dataState]);

  const InputFilter = (props: GridFilterCellProps) => (
    <InputFilterCellTemplate {...props}/>
  );

  const RenderCustomCell = (props: CustomGridCellProps, field: string) => {
    const template = fieldToCellMapping[field?.split(".")[0]];
    if (template) {
      return template(props);
    }
    return Default(props);
  };

  const onRowClick = ({ dataItem }) => {
    const { id } = dataItem;
    const index = findIndex(approvalLevels, { id });
    const item = find(approvalLevels, { id } );
    handleEdit(index, item as POApprovalMatrixLevel);
  };

  const columnRenderer = (gridWidth: number) => (
    sortBy(columnDefinitions, ["orderIndex"]).map((column, idx) => (
      <GridColumn
        key={idx}
        {...column}
        title={startCase(getTranslatedText(column.title))}
        minResizableWidth={200}
        cell={(props) => RenderCustomCell({ ...props, cellRowClick: onRowClick }, column.field)}
        filterCell={InputFilter}
        headerCell={
          column.title ? (props) => <ColumnHeader {...props} /> : undefined
        }
        columnMenu={
          column.showColumnMenu
            ? (props) => (
              <GridColumnMenuGroup {...props} />
            )
            : undefined
        }
        width={setColumnWidth(column.width as number, gridWidth)}
      />
    )));

  const columnReorder = ({ columns }: GridColumnReorderEvent) => {
    let dataColumns: KendoColumn[] = gridConfiguration.columns;
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(columns, { field: column.field });
      column.orderIndex = columnObject?.orderIndex;
      return column;
    });
    setColumnDefinitions(dataColumns);
  };

  const tableRenderer = ({ width }: Size) => (
    <>
      <KendoGlobalization>
        <KendoGrid
          className={classes.root}
          style={{ width: `${width}px` }}
          data={resultState.data}
          total={resultState.total}
          pageable={false}
          sortable={true}
          filterable={true}
          reorderable={true}
          groupable={true}
          onDataStateChange={onDataStateChange}
          {...dataState}
          expandField="expanded"
          onColumnReorder={columnReorder}
        >
          {columnRenderer(width)}
          <GridNoRecords>{ !resultState.total && <NoDataFound />}</GridNoRecords>
        </KendoGrid>
      </KendoGlobalization>
    </>
  );

  return (<AutoSizer>{tableRenderer}</AutoSizer>);

};

export default FBPOAMKendoTable;
