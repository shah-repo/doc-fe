import { Button } from '@material-ui/core';
import { isEmpty, map, startCase } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { getFormattedDateString, MomentFormats } from '../../../../common/utils/date';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import ExportListIcon from '../../../components/common/kendo/ExportListIcon';
import Text from '../../../components/Text';
import useDialog from '../../../hooks/useDialog';
import ExportListDialog from '../../list/ExportListDialog/ExportListDialog';
import styles from './styles';

interface Props {
  gridData: DocumentRevision[];
  columns: any[];
  isGrouped: boolean;
}
const ExportButton: React.FunctionComponent<Props> = ({ gridData, columns, isGrouped }) => {
  const classes = styles();
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
        docId: e.document.docId,
        displayRevision: e.displayRevision,
        documentTitle: e.name,
        type: e.document.documentType.documentTypeAcronym,
        owner: e.owner.user.name,
        crId: e.changeRequest?.crId || '',
        status: e.displayStatus.toUpperCase(),
        effectiveDate: e.effectiveDate
          ? getFormattedDateString(e.effectiveDate, MomentFormats.MonthDateYear)
          : '',
      }));
    }
    const defaultEmptyColumn = headers.map((column) => ({ [column.key]: '' }));
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
