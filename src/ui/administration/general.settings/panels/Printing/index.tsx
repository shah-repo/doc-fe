import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { GridColumn } from '@progress/kendo-react-grid';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import { IconButton } from '../../../../components/forms/fields-next';
import StyledKendoGrid from '../../../../components/StyledKendoGrid/StyledKendoGrid';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';
import AddNewPrinter from './AddNewPrinter';
import useStyles from './styles';
import { withLabelPrinting } from './wrap';

const SELECTED_FIELD = 'printer.isActive';
const DATA_ITEM_KEY = 'apiKey';

const PrintingSettingsPanel: React.FC<SettingsPanelProps> = ({
  onAddNew,
  onConfirm,
  onCancel,
  onSelectionChange,
  onDelete,
  isOpen,
  dataResult,
  editData,
  formik,
  confirmationDialog,
  confirmDeletePrinter,
  cancelDeletePrinter,
  ...props
}) => {
  const ActionCell = (props: ZebraPrintSettings) => {
    const { dataItem } = props;
    const { cellStyle, deleteButton } = useStyles({ isActive: dataItem.printer?.isActive });
    return (<td className={`${cellStyle} k-command-cell`} >
      <Tooltip title={translate('common.edit')}>
        <IconButton
          kind="simple"
          color="primary"
          style={{ marginRight: '10px' }}
          disabled={!dataItem.printer?.isActive}
          onClick={() => onAddNew(dataItem)}
        >
          <FontAwesomeIcon
            icon={regular('pen-to-square')}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title={translate('common.delete')}>
        <IconButton
          kind="simple"
          onClick={() => onDelete(dataItem)}
          className={deleteButton}
          disabled={!dataItem.printer?.isActive}
        >
          <FontAwesomeIcon
            icon={regular('trash-can')}
          />
        </IconButton>
      </Tooltip>
    </td>);
  };

  const cellRender = (props) => {
    const { dataItem, field } = props;
    const { cellStyle } = useStyles({ isActive: dataItem?.printer?.isActive });
    return (<td className={`${cellStyle} k-command-cell`} >{get(dataItem, field)}</td>);
  };

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.printing')} onAddNew={onAddNew}>
      <StyledKendoGrid
        data={dataResult}
        selectedField={SELECTED_FIELD}
        dataItemKey={DATA_ITEM_KEY}
        selectable={{
          enabled: true,
          drag: false,
          cell: true,
          mode: 'multiple'
        }}
        onSelectionChange={onSelectionChange}>
        <GridColumn
          field="printer.isActive"
          title="Active"
          width={80}
          headerCell={() => <span>Active</span>} />
        <GridColumn
          field="printer.sn"
          cell={cellRender}
          title="Serial Number" />
        <GridColumn
          field="printer.name"
          cell={cellRender}
          title="Name" />
        <GridColumn
          title="Actions"
          cell={ActionCell}
          width={80} />
      </StyledKendoGrid>
      <AddNewPrinter {...{ isOpen, onCancel, editData, formik }} />
      {confirmationDialog.isOpen && (
        <AlertDialog
          dialog={confirmationDialog}
          confirmAction={confirmDeletePrinter}
          cancelAction={cancelDeletePrinter}
          message="printer.delete.alert"
        />
      )}
    </SettingsPanel>
  );
};

export default withLabelPrinting(PrintingSettingsPanel);
