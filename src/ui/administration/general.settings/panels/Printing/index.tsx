import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { GridColumn } from '@progress/kendo-react-grid';
import { FormikContextType } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { ZebraPrintSettings } from '../../../../../state/ducks/company/types';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import { IconButton } from '../../../../components/forms/fields-next';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import StyledKendoGrid from '../../../../components/StyledKendoGrid/StyledKendoGrid';
import { DialogHandler } from '../../../../hooks/useDialog';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';
import AddNewPrinter from './AddNewPrinter';
import useStyles from './styles';
import { withLabelPrinting } from './wrap';

const SELECTED_FIELD = 'printer.isActive';
const DATA_ITEM_KEY = 'apiKey';

interface PrintinfPanelProps extends SettingsPanelProps {
  onEdit?: (editData: ZebraPrintSettings) => void
  onDelete?: (data: ZebraPrintSettings) => void
  onUpdate?: () => void
  onCancel?: () => void
  isOpen?: boolean
  dataResult?: []
  onSelectionChange?: () => void
  formik?: FormikContextType<ZebraPrintSettings>
  confirmationDialog?: DialogHandler
  confirmDeletePrinter?: () => void
  cancelDeletePrinter?: () => void
}

const PrintingSettingsPanel: React.FC<PrintinfPanelProps> = ({
  onAddNew,
  onEdit,
  onCancel,
  onSelectionChange,
  onDelete,
  isOpen,
  dataResult,
  formik,
  confirmationDialog,
  confirmDeletePrinter,
  cancelDeletePrinter,
  ...props
}) => {
  const ActionCell = (props) => {
    const { dataItem, dataIndex } = props;
    const { cellStyle, deleteButton } = useStyles({ isActive: dataItem.printer?.isActive });
    return (<td className={`${cellStyle} k-command-cell`} >
      <Tooltip title={translate('common.edit')}>
        <IconButton
          kind="simple"
          color="primary"
          style={{ marginRight: '10px' }}
          onClick={() => onEdit(dataItem, dataIndex)}
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
    const value = get(dataItem, field);
    return (<td className="k-command-cell"><OverflowTooltip title={value}>{value}</OverflowTooltip></td>);
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
          mode: 'multiple',
        }}
        onSelectionChange={onSelectionChange}>
        <GridColumn
          field="printer.isActive"
          title={translate('administration.general.settings.printing.table.column.active')}
          width={80}
          headerCell={() => <span className="k-column-title">Active</span>} />
        <GridColumn
          field="printer.sn"
          title={translate('administration.general.settings.printing.table.column.serial.number')} />
        <GridColumn
          field="printer.name"
          cell={cellRender}
          title={translate('administration.general.settings.printing.table.column.name')} />
        <GridColumn
          title={translate('administration.general.settings.printing.table.column.actions')}
          cell={ActionCell}
          width={80} />
      </StyledKendoGrid>
      <AddNewPrinter {...{ isOpen, onCancel, formik }} />
      {confirmationDialog?.isOpen && (
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
