import { Box, Button, Grid, Typography } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { ReactComponent as ExportIcon } from "../../../assets/images/export_data.svg";
import { docRevSch } from "../../../common/normalizrSchema";
import {
  getFormattedDateString,
  MomentFormats,
} from "../../../common/utils/date";
import { TRAINING_RECORD_ROOT_URL } from "../../../state/ducks/training/constants";
import { TrainingListData } from "../../../state/ducks/training/types";
import {
  TableDataProps,
  TablePanelStateProps,
} from "../../components/table/types";
import Text from "../../components/Text";
import ExportListDialog from "../../document.revision/list/ExportListDialog/ExportListDialog";
import useDialog from "../../hooks/useDialog";
import { KendoPanel } from "./KendoPanel";
import KendoGridStyles from "./styles";

interface Props {
  tableName: string;
  data: TableDataProps<TrainingListData>;
  columns: any;
  tableCriteria: TablePanelStateProps;
}

export const KendoGridList: React.FunctionComponent<Props> = ({
  tableName,
  tableCriteria,
  data,
  columns,
}) => {
  const classes = KendoGridStyles();

  const dialog = useDialog();
  const headers = columns.columns.map((e) => ({
    label: e.title,
    key: e.field,
  }));

  const renderTableData = () => {
    if (!isEmpty(data)) {
      return data.map((e) => ({
        trId: e.trId,
        docId: e.trainingPlan.document.docId,
        revision: e.documentRevision.displayRevision,
        docRevTitle: e.documentRevision.name,
        userName: e.trainingPlan.employee.user?.name,
        createdAtAfter: e.createdAt
          ? getFormattedDateString(e.createdAt, MomentFormats.MonthDateYear)
          : "",
        dueOn: e.dueOn
          ? getFormattedDateString(e.dueOn, MomentFormats.MonthDateYear)
          : "",
        completedAtAfter: e.completedAt
          ? getFormattedDateString(e.completedAt, MomentFormats.MonthDateYear)
          : "Pending",
        tcId: e.trainingPlan?.curriculumDocIds,
      }));
    }
    const defaultEmptyColumn = headers.map((column) => ({ [column.key]: "" }));
    return [Object.assign({}, ...defaultEmptyColumn)];
  };

  const exportData = dialog.isOpen ? renderTableData() : [];

  return (
    <Grid container={true} className={classes.root}>
      <Grid item xs>
        <Typography className={classes.title}>Training</Typography>
      </Grid>
      <Grid item style={{ textAlign: "right", marginBottom: 10 }}>
        <Button
          variant="outlined"
          className={classes.exportListbutton}
          id="ListPresenter-export-list"
          data-cy="document.revision.export.list"
          onClick={dialog.open}
        >
          <Box display="flex">
            <ExportIcon className={classes.iconSvg} height={14} width={14} />
          </Box>
          <Text translation="document.revision.export.list" />
        </Button>
        <ExportListDialog
          data={exportData}
          {...{ dialog, headers }}
          customFileName="DocumentList"
        />
      </Grid>
      <Grid item={true} xs={12}>
        <KendoPanel
          columns={columns}
          queryUrl={TRAINING_RECORD_ROOT_URL}
          data={data}
          tableName={tableName}
          tableCriteria={tableCriteria}
          normalizrSchema={[docRevSch]}
        />
      </Grid>
    </Grid>
  );
};

export default KendoGridList;
