import { Box, Button, Grid, Typography } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { ReactComponent as ExportIcon } from "../../../assets/images/export_data.svg";
import { docRevSch } from "../../../common/normalizrSchema";
import {
  getFormattedDateString,
  MomentFormats,
} from "../../../common/utils/date";
import { TRAINING_RECORD_ROOT_URL } from "../../../state/ducks/training/constants";
import { KendoGridConfiguration, KendoGridCriteria } from "../../components/common/kendo/types";
import Text from "../../components/Text";
import ExportListDialog from "../../document.revision/list/ExportListDialog/ExportListDialog";
import useDialog from "../../hooks/useDialog";
import { KendoPanel } from "./KendoPanel";
import KendoGridStyles from "./styles";

interface Props<T> {
  tableName: string;
  gridData: T[];
  columns: KendoGridConfiguration;
  tableCriteria: KendoGridCriteria;
}

const KendoGridList: React.FunctionComponent<Props<any>> = ({
  tableName,
  tableCriteria,
  gridData,
  columns,
}) => {
  const classes = KendoGridStyles();

  const dialog = useDialog();
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : "";

  const headers = columns.columns.map((e) => ({
    label: getTranslatedText(e.title).toUpperCase(),
    key: e.field,
  }));

  const renderTableData = () => {
    if (!isEmpty(gridData)) {
      return gridData.map((e) => ({
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
          : getTranslatedText("common.pending"),
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
        <Typography className={classes.title}>
          <Text translation="page.title.training" />
        </Typography>
      </Grid>
      <Grid item className={classes.gridClass}>
        <Button
          variant="outlined"
          className={classes.exportListbutton}
          id="ListPresenter-export-list"
          data-cy="document.revision.export.list"
          onClick={dialog.open}
        >
          <Box display="flex">
            <ExportIcon className={classes.iconSvg} />
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
          gridConfiguration={columns}
          gridData={gridData}
          tableName={tableName}
          tableCriteria={tableCriteria}
          queryUrl={TRAINING_RECORD_ROOT_URL}
          normalizrSchema={[docRevSch]}
        />
      </Grid>
    </Grid>
  );
};

export default KendoGridList;
