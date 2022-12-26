import { Button } from "@material-ui/core";
import { isEmpty, map, startCase } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { TrainingListData } from "../../../state/ducks/training/types";
import ExportListIcon from "../../components/common/kendo/ExportListIcon";
import Text from "../../components/Text";
import styles from "../../document.revision/grid/ExportButton/styles";
import ExportListDialog from "../../document.revision/list/ExportListDialog/ExportListDialog";
import useDialog from "../../hooks/useDialog";

interface Props {
  gridData: TrainingListData[];
  columns: any[];
  isGrouped: boolean;
}
const ExportButton: React.FunctionComponent<Props> = ({ gridData, columns, isGrouped }) => {
  const classes = styles();
  const dialog = useDialog();
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : "";
  const headers = map(columns, (column) => ({
    label: startCase(getTranslatedText(column.title)),
    key: column.field,
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
          ? getFormattedDateString(e.completedAt, MomentFormats.DateTimeComplete)
          : getTranslatedText("common.pending"),
        tcId: e.trainingPlan?.curriculumDocIds,
      }));
    }
    const defaultEmptyColumn = headers.map((column) => ({ [column.key]: "" }));
    return [Object.assign({}, ...defaultEmptyColumn)];
  };
  const exportData = dialog.isOpen ? renderTableData() : [];
  return (
    <>
      <Button
        variant="outlined"
        className={classes.exportListbutton}
        id="ListPresenter-export-list"
        data-cy="document.revision.export.list"
        onClick={dialog.open}
        disabled={isGrouped}
      >
        <ExportListIcon isGrouped={isGrouped} />
        <Text translation="document.revision.export.list" />
      </Button>
      <ExportListDialog
        data={exportData}
        {...{ dialog, headers }}
        customFileName="DocumentList"
      />
    </>
  );
};

export default ExportButton;
