import { Box, Button } from "@material-ui/core";
import { isEmpty, map, startCase } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { ReactComponent as ExportIcon } from "../../../assets/images/export_data.svg";
import { UMExportDataProp } from "../../../state/ducks/userManagement/types";
import { DisplayText, TranslatedText } from "../../components/common/kendo/helpers";
import { KendoColumn } from "../../components/common/kendo/types";
import Text from "../../components/Text";
import ExportListDialog from "../../document.revision/list/ExportListDialog/ExportListDialog";
import { styles } from "../../documentType/list/styles";
import useDialog from "../../hooks/useDialog";

interface Props {
  gridData: Partial<UMExportDataProp>[];
  columns: KendoColumn[];
}
const UMExport: React.FunctionComponent<Props> = ({ gridData, columns }) => {
  const classes = styles();
  const dialog = useDialog();
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : "";
  const headers = map(columns, (column) => ({
    label: startCase(getTranslatedText(column.title)),
    key: column.field,
  }));
  const renderTableData = () => {
    // modify here
    if (!isEmpty(gridData)) {
      return gridData.map((e) => ({
        status: e.status,
        userName: e.user?.name,
        userEmail: e.user?.email,
        groups: e.groups,
        active: e.active
          ? intl.formatMessage({ id: TranslatedText[DisplayText.ACTIVE] })
          : intl.formatMessage({ id: TranslatedText[DisplayText.INACTIVE] }),
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
        data-cy="um-open-export-dialog"
        onClick={dialog.open}
      >
        <Box display="flex">
          <ExportIcon
            className={classes.iconSvg}
            height={14} width={14} />
        </Box>
        <Text translation="document.revision.export.list" />
      </Button>
      <ExportListDialog
        data={exportData}
        {...{ dialog, headers }}
        customFileName="UserManagement"
      />
    </>
  );
};

export default UMExport;
