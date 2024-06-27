import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { GridCellProps } from '@progress/kendo-react-grid';
import { FormikContextType } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { ZebraPrintSettings } from '../../../../../state/ducks/company/types';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import { IconButton } from '../../../../components/forms/fields-next';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { DialogHandler } from '../../../../hooks/useDialog';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';
import AddNewPrinter from './AddNewPrinter';
import useStyles from './styles';
import { withLabelPrinting } from './wrap';

const SELECTED_FIELD = 'printer.isActive';
const DATA_ITEM_KEY = 'apiKey';

interface PrintinfPanelProps extends SettingsPanelProps {
  onEdit: (editData: ZebraPrintSettings, rowIndex: number) => void
  onDelete: (data: ZebraPrintSettings) => void
  onUpdate: () => void
  onCancel: () => void
  isOpened: boolean
  dataResult: []
  onSelectionChange: () => void
  formik: FormikContextType<ZebraPrintSettings>
  confirmationDialog: DialogHandler
  confirmDeletePrinter: () => void
  cancelDeletePrinter: () => void
  isFormDirty: boolean
  onFormikFieldChange: React.FormEventHandler<HTMLDivElement>
}

interface SchemaBuilderProps {
  ActionCell: (props: any) => JSX.Element
  cellRender: (props: any) => JSX.Element
}

type schemaBuilder = (options: SchemaBuilderProps) => Array<ColumnDefinition<{}>>;
const buildSchema: schemaBuilder = ({ ActionCell, cellRender }) => {
  return [
    {
      id: 'isActive',
      field: 'printer.isActive',
      title: 'administration.general.settings.printing.table.column.active',
      width: 80,
    },
    {
      id: 'sn',
      field: 'printer.sn',
      title: 'administration.general.settings.printing.table.column.serial.number',
    },
    {
      id: 'name',
      field: 'printer.name',
      title: 'administration.general.settings.printing.table.column.name',
      cell: cellRender,
    },
    {
      id: 'actions',
      field: 'actions',
      filterable: false,
      title: 'administration.general.settings.printing.table.column.actions',
      cell: ActionCell,
      width: 80,
    },
  ];
};

const PrintingSettingsPanel: React.FC<PrintinfPanelProps> = ({
  onAddNew,
  onEdit,
  onCancel,
  onSelectionChange,
  onDelete,
  isOpened,
  dataResult,
  formik,
  confirmationDialog,
  confirmDeletePrinter,
  cancelDeletePrinter,
  isFormDirty,
  onFormikFieldChange,
  ...props
}) => {
  const ActionCell = (props: GridCellProps) => {
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

  const cellRender = (props: GridCellProps) => {
    const { dataItem, field } = props;
    const value = get(dataItem, field ?? '');
    return (<td className="k-command-cell"><OverflowTooltip title={value}>{value}</OverflowTooltip></td>);
  };

  const schema = buildSchema({ ActionCell, cellRender });

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.printing')} onAddNew={onAddNew}>
      <KendoDataGrid schema={schema}
        data={dataResult ?? []}
        selectedField={SELECTED_FIELD}
        dataItemKey={DATA_ITEM_KEY}
        selectable={{
          enabled: true,
          drag: false,
          cell: true,
          mode: 'multiple',
        }}
        onSelectionChange={onSelectionChange} />
      <AddNewPrinter {...{ isOpened, onCancel, formik, isFormDirty, onFormikFieldChange }} />
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
