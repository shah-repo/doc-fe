import { Box, Button, Grid } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { ReactComponent as ExportIcon } from "../../../assets/images/icon_export_data.svg";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { TrainingListData, TrainingRecordQuery, TRAINING_RECORD_ROOT_URL } from "../../../state/ducks/training";
import Date from "../../components/Date";
import ClearFilters from "../../components/table/ClearFilters";
import { TableColumnProps } from "../../components/table/column/types";
import DocumentInfo from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import ExportListDialog from "../../document.revision/list/ExportListDialog/ExportListDialog";
import { documentRevisionEffectiveDateOption, dueDateOption, trainingCompletedOnDateOption } from "../../document.revision/utils/helpers";
import useDialog from "../../hooks/useDialog";
import { styles } from "./styles";

interface Props {
  tableName: string;
  data: TableDataProps<TrainingListData>;
  clearFilter?: () => void;
  tableCriteria: TablePanelStateProps;
}

const TrainingListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  data,
  clearFilter,
  tableCriteria,
}) => {
  const classes = styles();
  const dialog = useDialog();

  const getDateOption = (dateOptions, id) => dateOptions().find((e) =>
    e.value === tableCriteria.queryDict?.[id])?.text;

  const headers = [
    { label: `DOC ID: ${tableCriteria.queryDict?.docId  || ""}`, key: "docId" },
    { label: `REVISION: ${tableCriteria.queryDict?.revision  || ""}`, key: "revision" },
    { label: `DOCUMENT TITLE: ${tableCriteria.queryDict?.docRevTitle  || ""}`, key: "docRevTitle" },
    { label: `TRAINEE: ${tableCriteria.queryDict?.userName  || ""}`, key: "userName" },
    {
      label: `ASSIGN DATE: ${getDateOption(documentRevisionEffectiveDateOption, "createdAtAfter")  || ""}`,
      key: "createdAtAfter",
    },
    { label: `DUE DATE: ${getDateOption(dueDateOption, "dueOn")  || ""}`, key: "dueOn" },
    {
      label: `COMPLETED ON: ${getDateOption(trainingCompletedOnDateOption, "completedAtAfter")  || ""}`,
      key: "completedAtAfter",
    },
  ];
  const renderTableData = () => {
    if (!isEmpty(data)) {
      return data.map((e) => ({
        docId: e.trainingPlan.document.docId,
        revision: e.documentRevision.revision,
        docRevTitle: e.documentRevision.name,
        userName: e.trainingPlan.employee.user?.name,
        createdAtAfter: e.createdAt ? getFormattedDateString(e.createdAt, MomentFormats.MonthDateYear) : "",
        dueOn: e.dueOn ? getFormattedDateString(e.dueOn, MomentFormats.MonthDateYear) : "",
        completedAtAfter: e.completedAt ?
          getFormattedDateString(e.completedAt, MomentFormats.MonthDateYear) : "Pending",
      }));
    }
    const defaultEmptyColumn = headers.map((column) => ({ [column.key]: "" }));
    return [Object.assign({}, ...defaultEmptyColumn)];
  };

  const exportedData = dialog.isOpen ? renderTableData() : [];

  const columns: TableColumnProps<TrainingRecordQuery>[] = [
    {
      key: "docId",
      id: "TrainingListPresenter-id",
      label: "common.docId",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.trainingPlan.document.docId,
        width: 75,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.docId,
      },
    },
    {
      key: "revision",
      id: "TrainingListPresenter-revision",
      label: "common.revision",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.documentRevision.displayRevision,
        width: 75,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.revision,
      },
    },
    {
      key: "docRevTitle",
      id: "TrainingListPresenter-title",
      label: "document.title",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.documentRevision.name,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.docRevTitle,
      },
    },
    {
      key: "userName",
      id: "TrainingListPresenter-trainee",
      label: "common.trainee",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.trainingPlan.employee.user.name,
        width: 75,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.userName,
      },
    },
    {
      key: "createdAtAfter",
      id: "TrainingListPresenter-assignDate",
      label: "common.assign.date",
      columnOptions: {
        // eslint-disable-next-line react/display-name
        cellDataGetter: ({ rowData }) => <Date value={rowData.createdAt}/>,
        width: 130,
      },
      searchOptions: {
        searchType: "select",
        selectOptions: documentRevisionEffectiveDateOption(),
        defaultValue: tableCriteria.queryDict?.createdAtAfter,
      },
    },
    {
      key: "dueOn",
      id: "TrainingListPresenter-dueDate",
      label: "common.due.date",
      columnOptions: {
        // eslint-disable-next-line react/display-name
        cellDataGetter: ({ rowData }) => <Date value={rowData.dueOn}/>,
        width: 130,
      },
      searchOptions: {
        searchType: "select",
        selectOptions: dueDateOption(),
        defaultValue: tableCriteria.queryDict?.dueOn,
      },
    },
    {
      key: "completedAtAfter",
      id: "TrainingListPresenter-completedOn",
      label: "common.completed.on",
      searchOptions: {
        searchType: "select",
        selectOptions: trainingCompletedOnDateOption(),
        defaultValue: tableCriteria.queryDict?.completedAtAfter,
      },
      columnOptions: {
        // eslint-disable-next-line react/display-name
        cellDataGetter: ({ rowData }) => rowData.completedAt ?
          getFormattedDateString(rowData.completedAt, MomentFormats.DateTimeComplete) : "Pending",
      },
    },
  ];

  const customDataSet = (data: TrainingRecordQuery[]) =>
    data.filter((e) => e.isValid);

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <ClearFilters {...{ clearFilter }}/>
        <DocumentInfo numberOfRecords={data.length} />
      </Grid>
      <Grid item={true} xs={6} className={classes.container}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          data-cy="document.revision.export.list"
          onClick={dialog.open}
        >
          <Box mr={1}>
            <ExportIcon className={classes.iconSvg} />
          </Box>
          <Text translation="document.revision.export.list" />
        </Button>
        <ExportListDialog
          {...{ dialog, headers }}
          data={exportedData}
          customFileName="TrainingList"
        />
      </Grid>
      <Grid item={true} className={classes.item}>
        <TablePanel<TrainingRecordQuery>
          columns={columns}
          queryUrl={TRAINING_RECORD_ROOT_URL}
          cellMeasure={true}
          tableName={tableName}
          customDataSet={customDataSet}
        />
      </Grid>
    </Grid>
  );
};

export default TrainingListPresenter;
