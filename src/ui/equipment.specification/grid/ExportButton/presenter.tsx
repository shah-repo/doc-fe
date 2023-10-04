import { Button } from '@material-ui/core';
import { isEmpty, map, startCase } from 'lodash';
import React from 'react';
import { getFormattedDateString, MomentFormats } from '../../../../common/utils/date';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import ExportListIcon from '../../../components/common/kendo/ExportListIcon';
import Text from '../../../components/Text';
import useDialog from '../../../hooks/useDialog';
import ExportListDialog from './ExportListDialog';
import useStyles from './styles';
import { intl } from '../../../../common/intl';

interface Props {
  gridData: DocumentRevision[]
  columns: any[]
  isGrouped: boolean
}
const ExportButton: React.FunctionComponent<Props> = ({ gridData, columns, isGrouped }) => {
  const classes = useStyles();
  const dialog = useDialog();
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
        relatedEquipment: e.document.relatedEquipment.join(', '),
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
        data-cy="equipment-specification-export-list"
        onClick={dialog.open}
        disabled={isGrouped}
      >
        <ExportListIcon isGrouped={isGrouped} />
        <Text translation="equipment.specification.export.list" />
      </Button>
      <ExportListDialog
        data={exportData}
        {...{ dialog, headers }}
        customFileName="EquipmentSpecificationList"
      />
    </>
  );
};

export default ExportButton;
