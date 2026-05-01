import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import React from 'react';
import { translate } from '../../../common/intl';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import DropdownFilter from '../FBApprovalMatrix/components/DropdownFilter';
import { createOption } from '../FBApprovalMatrix/components/Grid';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { SerialNumber, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUsage } from '../FBSerials/types';
import ActionsCell from './components/ActionsCell';
import NotesCell from './components/NotesCell';
import SelectFilter from './components/SelectFilter';
import StatusCell from './components/StatusCell';
import TextCell from './components/TextCell';
import UsageCell from './components/UsageCell';
import useStyles from './styles';

interface SchemaOptions {
  isAllSelected: boolean
  canSelect?: boolean
  onCheckAllToggle: (event: CheckboxChangeEvent) => void
  onUpdate?: (id: string, data: SerialNumberUpdateData) => void
  onDelete?: (id: string) => void
}

export const useSchema = ({
  isAllSelected,
  canSelect,
  onCheckAllToggle,
  onUpdate,
  onDelete,
}: SchemaOptions): Array<ColumnDefinition<SerialNumber>> => {
  const classes = useStyles();

  const statusOptions = React.useMemo(() => [
    createOption(null, translate('form.builder.serials.no.status')),
    createOption(SerialNumberStatus.ACCEPTED, translate('form.builder.serials.accepted')),
    createOption(SerialNumberStatus.REJECTED, translate('form.builder.serials.rejected')),
  ], []);

  const usageOptions = React.useMemo(() => [
    createOption(null, translate('form.builder.serials.no.usage')),
    createOption(SerialNumberUsage.RND, translate('form.builder.serials.usage.rnd')),
    createOption(SerialNumberUsage.DO_NOT_USE, translate('form.builder.serials.usage.do.not.use')),
  ], []);

  const allOption = React.useMemo(() => createOption(undefined, translate('common.all')), []);

  return React.useMemo(() => {
    const StatusFilter: React.FC<GridFilterCellProps> = (props) => (
      <DropdownFilter
        {...props}
        data={statusOptions}
        defaultItem={allOption}
      />
    );

    const UsageFilter: React.FC<GridFilterCellProps> = (props) => (
      <DropdownFilter
        {...props}
        data={usageOptions}
        defaultItem={allOption}
      />
    );

    return [
      {
        id: 'id',
        field: 'isSelected',
        title: 'Select',
        width: 65,
        resizable: false,
        hidden: !canSelect,
        filterCell: (props) => <SelectFilter {...props} isChecked={isAllSelected} onCheck={onCheckAllToggle} />,
        className: classes.checkbox,
      },
      {
        id: 'index',
        field: 'index',
        title: 'form.builder.serials.item',
        width: 55,
        resizable: false,
        filterable: false,
        template: ({ dataItem, dataIndex }) => {
          const rowIndex = (dataItem as { index?: number }).index ?? (dataIndex ?? 0) + 1;
          return <div>{rowIndex}</div>;
        },
      },
      {
        id: 'serialNumber',
        field: 'serialNumber',
        resizable: true,
        filterCell: InputFilter,
        template: (props) => <TextCell {...props} />,
        title: 'form.builder.serials.serial.number',
      },
      {
        id: 'status',
        field: 'status',
        title: 'form.builder.serials.status',
        resizable: false,
        width: 160,
        filterCell: StatusFilter,
        template: (props) => (
          <StatusCell {...props} options={statusOptions} onChange={(id, status) => onUpdate?.(id, { status })} />
        ),
      },
      {
        id: 'usage',
        field: 'usage',
        title: 'form.builder.serials.usage',
        width: 150,
        resizable: false,
        filterCell: UsageFilter,
        template: (props) => (
          <UsageCell {...props} options={usageOptions} onChange={(id, usage) => onUpdate?.(id, { usage })} />
        ),
      },
      {
        id: 'notes',
        field: 'notes',
        title: 'form.builder.serials.notes',
        filterCell: InputFilter,
        template: (props) => (
          <NotesCell {...props} onChange={(id, notes) => onUpdate?.(id, { notes })} />
        ),
      },
      {
        id: 'actions',
        field: 'actions',
        title: 'common.actions',
        width: 80,
        filterable: false,
        sortable: false,
        resizable: false,
        hidden: !onDelete,
        template: (props) => (
          <ActionsCell {...props} onDelete={onDelete} />
        ),
      },
    ];
  }, [
    allOption,
    canSelect,
    classes.checkbox,
    isAllSelected,
    onCheckAllToggle,
    onDelete,
    onUpdate,
    statusOptions,
    usageOptions,
  ]);
};
