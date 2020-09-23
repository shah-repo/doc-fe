import { Box, Button, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { ReactComponent as ExportIcon } from "../../../assets/images/icon_export_data.svg";
import { TRAINING_RECORD_ROOT_URL } from "../../../state/ducks/training/constants";
import { TrainingRecordQuery } from "../../../state/ducks/training/types";
import Date from "../../components/Date";
import ClearFilters from "../../components/table/ClearFilters";
import { TableColumnProps } from "../../components/table/column/types";
import DocumentInfo from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import ExportListDialog from "../../document.revision/list/ExportListDialog/ExportListDialog";
import useDialog from "../../hooks/useDialog";
import { styles } from "./styles";

export interface Props {
  tableName: string;
  data: TableDataProps<any>;
  clearFilter?: () => void;
  tableCriteria: TablePanelStateProps;
}

export const TrainingListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  data,
  clearFilter,
  tableCriteria,
}) => {
  const classes = styles();
  const dialog = useDialog();
  const [fileName, saveFileName] = useState("");
  const handleOpen = () => {
    dialog.open();
    saveFileName("");
  };

  const headers = [
    { label: `DOC ID:`, key: "docId" },
    { label: `REVISION:`, key: "documentRevision" },
    { label: `DOCUMENT TITLE:`, key: "documentRevision" },
    { label: `TRAINEE:`, key: "employee" },
    { label: `ASSIGN DATE:`, key: "createdAt" },
    { label: `DUE DATE:`, key: "dueOn" },
    { label: `COMPLETED ON:`, key: "status" },
  ];
  const columns: TableColumnProps<TrainingRecordQuery>[] = [
    {
      // Issue with Key Here cannot do trainingPlan.document.docId so it wont work in headers for export list
      key: "trainingPlan",
      id: "TrainingListPresenter-id",
      label: "common.docId",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.trainingPlan.document.docId,
        width: 75,
      },
      searchOptions: {
        dataKey: "documentRevision", // search options not working for query
      },
    },
    {
      // Issue with Key Here cannot do documentRevision.revision so it wont work in headers for export list
      key: "documentRevision",
      id: "TrainingListPresenter-revision",
      label: "common.revision",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.documentRevision.revision,
        width: 75,
      },
      searchOptions: {
        dataKey: "documentRevision", // search options not working for query
      },
    },
    {
      // Issue with Key Here cannot do documentRevision.name so it wont work in headers for export list
      key: "documentRevision",
      id: "TrainingListPresenter-title",
      label: "document.title",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.documentRevision.name,
      },
      searchOptions: {
        dataKey: "documentRevision", // search options not working for query
      },
    },
    {
      // Issue with Key Here cannot do trainingPlan.employee.user.name so it wont work in headers for export list
      key: "trainingPlan",
      id: "TrainingListPresenter-trainee",
      label: "common.trainee",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.trainingPlan.employee.user.name,
        width: 75,
      },
      searchOptions: {
        // search options not working for query
      },
    },
    {
      key: "createdAt",
      id: "TrainingListPresenter-assignDate",
      label: "common.assign.date",
      columnOptions: {
        // eslint-disable-next-line react/display-name
        cellDataGetter: ({ rowData }) => <Date value={rowData.createdAt}/>,
        width: 75,
      },
      searchOptions: {
        dataKey: "createdAt", // search options not working for query
      },
    },
    {
      key: "dueOn",
      id: "TrainingListPresenter-dueDate",
      label: "common.due.date",
      columnOptions: {
        // eslint-disable-next-line react/display-name
        cellDataGetter: ({ rowData }) => <Date value={rowData.dueOn}/>,
        width: 75,
      },
      searchOptions: {
        dataKey: "dueOn", // search options not working for query
      },
    },
    {
      key: "completedAt",
      id: "TrainingListPresenter-completedOn",
      label: "common.completed.on",
      searchOptions: {
        dataKey: "completedAt", // search options not working for query
      },
      columnOptions: {
        // eslint-disable-next-line react/display-name
        cellDataGetter: ({ rowData }) => rowData.completedAt ? <Date value={rowData.completedAt}/> : "Pending",
      },
    },
  ];


  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <ClearFilters {...{ clearFilter }}/>
        <DocumentInfo numberOfRecords={data.length} />
      </Grid>
      <Grid item={true} xs={6} style={{ textAlign: "right", marginBottom: "16px" }}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          style={{ marginRight: 5 }}
          id="ListPresenter-export-list"
          data-cy="document.revision.export.list"
          onClick={handleOpen}
        >
          <Box marginRight={1}>
            <ExportIcon className={classes.iconSvg} />
          </Box>
          <Text translation="document.revision.export.list" />
        </Button>
        <ExportListDialog
          {...{ dialog, headers, data, fileName, saveFileName }}
        />
      </Grid>
      <Grid item={true} className={classes.item}>
        <TablePanel<TrainingRecordQuery>
          columns={columns}
          queryUrl={TRAINING_RECORD_ROOT_URL}
          cellMeasure={true}
          tableName={tableName}
          onSelect={undefined}
        />
      </Grid>
    </Grid>
  );
};

export default TrainingListPresenter;
