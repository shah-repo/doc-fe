import { isEmpty, map, startCase } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { ReactComponent as ExportIcon } from '../../../assets/images/export_new.svg';
import { translate } from '../../../common/intl';
import { UMExportDataProp } from '../../../state/ducks/userManagement/types';
import { DisplayText, TranslatedText } from '../../components/common/kendo/helpers';
import { KendoColumn } from '../../components/common/kendo/types';
import { Button } from '../../components/forms/fields-next';
import ExportListDialog from '../../document.revision/list/ExportListDialog/ExportListDialog';
import useDialog from '../../hooks/useDialog';

interface Props {
  gridData: Array<Partial<UMExportDataProp>>
  columns: KendoColumn[]
  isGrouped: boolean
}
const UMExport: React.FunctionComponent<Props> = ({ gridData, columns, isGrouped }) => {
  const dialog = useDialog();
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : '';
  const headers = map(columns, (column) => ({
    label: startCase(getTranslatedText(column.title)),
    key: column.field,
  }));
  const renderTableData = () => {
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
    const defaultEmptyColumn = headers.map((column) => ({ [column.key]: '' }));
    return [Object.assign({}, ...defaultEmptyColumn)];
  };
  const exportData = dialog.isOpen ? renderTableData() : [];
  return (
    <>
      <Button
        kind="outlined"
        id="ListPresenter-export-list"
        data-cy="um-open-export-dialog"
        onClick={dialog.open}
        disabled={isGrouped}
        startIcon={<ExportIcon />}
        size="small"
      >
        {translate('document.revision.export.list')}
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
