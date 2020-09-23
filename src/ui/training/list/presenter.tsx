import { Grid } from "@material-ui/core";
import React from "react";
import ClearFilters from "../../components/table/ClearFilters";
import { TableColumnProps } from "../../components/table/column/types";
import DocumentInfo from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import { styles } from "./styles";
import Date from "../../components/Date";
import { TRAINING_RECORD_ROOT_URL } from "../../../state/ducks/training/constants";
import { TrainingRecordQuery } from "../../../state/ducks/training/types";

export interface Props {
  tableName: string;
  tableData: TableDataProps<any>;
  clearFilter?: () => void;
  tableCriteria: TablePanelStateProps;
}

export const TrainingListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableData,
  clearFilter,
  tableCriteria,
}) => {
  const classes = styles();

  const columns: TableColumnProps<TrainingRecordQuery>[] = [
    {
      key: "documentRevision" ,
      id: "TrainingListPresenter-id",
      label: "common.docId",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.trainingPlan.document.docId,
        width: 75,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.groupName,
      },
    },
    {
      key: "documentRevision" ,
      id: "TrainingListPresenter-revision",
      label: "common.revision",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.documentRevision.revision,
        width: 75,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.groupName,
      },
    },
    {
      key: "documentRevision" ,
      id: "TrainingListPresenter-title",
      label: "document.title",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.documentRevision.name,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.groupName,
      },
    },
    {
      key: "employee" ,
      id: "TrainingListPresenter-trainee",
      label: "common.trainee",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.trainingPlan.employee.user.name,
        width: 75,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.groupName,
      },
    },
    {
      key: "createdAt" ,
      id: "TrainingListPresenter-assignDate",
      label: "common.assign.date",
      columnOptions: {
        cellDataGetter: ({ rowData }) => <Date value={rowData.createdAt}/>,
        width: 75,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.groupName,
      },
    },
    {
      key: "dueOn" ,
      id: "TrainingListPresenter-dueDate",
      label: "common.due.date",
      columnOptions: {
        cellDataGetter: ({ rowData }) => <Date value={rowData.dueOn}/>,
        width: 75,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.userName,
      },
    },
    {
      key: "completedAt",
      id: "TrainingListPresenter-completedOn",
      label: "common.completed.on",
      searchOptions: {
        searchType: "select",
        selectOptions: [
          { text: "Official", value: "true" },
          { text: "Unofficial", value: "false" },
        ],
        defaultValue: tableCriteria.queryDict?.isOfficial,
      },
      columnOptions: {
        cellDataGetter: ({ rowData }) => <Date value={rowData.completedAt}/>,
      },
    },
  ];

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <ClearFilters {...{ clearFilter }}/>
        <DocumentInfo numberOfRecords={tableData.length} />
      </Grid>
      <Grid item={true} className={classes.item}>
        <TablePanel<TrainingRecordQuery>
          columns={columns}
          queryUrl={TRAINING_RECORD_ROOT_URL}
          cellMeasure={true}
          tableName={tableName}
          onSelect={() => () => {return}}
        />
      </Grid>
    </Grid>
  );
};

export default TrainingListPresenter;
