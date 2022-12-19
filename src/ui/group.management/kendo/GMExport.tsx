import { Button } from "@material-ui/core";
import { isEmpty, map, startCase } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import ExportListIcon from "../../components/common/kendo/ExportListIcon";
import { DisplayText, TranslatedText } from "../../components/common/kendo/helpers";
import Text from "../../components/Text";
import ExportListDialog from "../../document.revision/list/ExportListDialog/ExportListDialog";
import { styles } from "../../documentType/list/styles";
import useDialog from "../../hooks/useDialog";

interface Props {
  gridData: any[];
  columns: any[];
  isGrouped: boolean;
}
const GMExport: React.FunctionComponent<Props> = ({ gridData, columns, isGrouped }) => {
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
        isOfficial: e.isOfficial
          ? intl.formatMessage({ id: TranslatedText[DisplayText.OFFICIAL] })
          : intl.formatMessage({ id: TranslatedText[DisplayText.UNOFFICIAL] }),
        name: e.name,
        memberNames: e.memberNames,
        formattedPermissions: e.formattedPermissions,
        formattedTags: e.formattedTags,
        parentName: e.parentName,
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
        style = {{ marginRight: 0 }}
        id="ListPresenter-export-list"
        data-cy="gm-open-export-dialog"
        onClick={dialog.open}
        disabled={isGrouped}
      >
        <ExportListIcon isGrouped={isGrouped} />
        <Text translation="document.revision.export.list" />
      </Button>
      <ExportListDialog
        data={exportData}
        {...{ dialog, headers }}
        customFileName="GroupManagement"
      />
    </>
  );
};

export default GMExport;
