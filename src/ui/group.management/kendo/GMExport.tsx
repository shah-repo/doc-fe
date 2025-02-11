import { isEmpty, map, startCase } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { ReactComponent as ExportIcon } from '../../../assets/images/export_new.svg';
import { translate } from '../../../common/intl';
import { DisplayText, TranslatedText } from '../../components/common/kendo/helpers';
import { Button } from '../../components/forms/fields-next';
import ExportListDialog from '../../document.revision/list/ExportListDialog/ExportListDialog';
import useDialog from '../../hooks/useDialog';

interface Props {
  gridData: any[]
  columns: any[]
  isGrouped: boolean
}
const GMExport: React.FunctionComponent<Props> = ({ gridData, columns, isGrouped }) => {
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
    const defaultEmptyColumn = headers.map((column) => ({ [column.key]: '' }));
    return [Object.assign({}, ...defaultEmptyColumn)];
  };
  const exportData = dialog.isOpen ? renderTableData() : [];
  return (
    <>
      <Button
        kind="outlined"
        id="ListPresenter-export-list"
        data-cy="gm-open-export-dialog"
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
        customFileName="GroupManagement"
      />
    </>
  );
};

export default GMExport;
