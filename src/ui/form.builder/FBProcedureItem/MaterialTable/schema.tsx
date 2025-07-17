// import ActionsCellTemplate from './components/ActionsCellTemplate';
// import { UnitsCellTemplate } from './components/UnitsCellTemplate';
import { TreeListColumnProps } from '@progress/kendo-react-treelist';
import React from 'react';
import { translate } from '../../../../common/intl';
import PartIdCellTemplate from './components/PartIdCellTemplate';
import { SchemaOptions } from './types';

export const buildSchema = ({
  units,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
  onOpenQuickView,
  onEdit,
}: SchemaOptions): TreeListColumnProps[] => {
  return [
    {
      id: 'plannedId',
      field: 'plannedId',
      title: translate('form.builder.procedure.material.table.planned.id.title'),
      cell: (props) => <PartIdCellTemplate {...props} />,
      // template: (props) => <SerialNumberCellTemplate {...props} onClick={onRowClick} />,
      // filterable: false,
      width: 150,
    },
    {
      id: 'lotId',
      field: 'lotId',
      title: translate('form.builder.procedure.material.table.lot.number.title'),
      // template: (props) => <LotIdCellTemplate {...props} onClick={onRowClick} lots={lots} />,
      // filterable: false,
      width: 150,
    },
    // {
    //   id: 'actualId',
    //   field: 'actualId',
    //   title: 'form.builder.procedure.material.table.actual.id.title',
    //   // template: (props) => <QuantityAssignedCellTemplate {...props} onClick={onRowClick} />,
    //   filterable: false,
    //   width: 150,
    // },
    {
      id: 'quantity',
      field: 'quantity',
      title: translate('form.builder.procedure.material.table.quantity.title'),
      // template: (props) => <UnitsCellTemplate {...props} options={units} onClick={onRowClick} />,
      // filterable: false,
      width: 150,
    },
    {
      id: 'unit',
      field: 'unit',
      title: translate('form.builder.procedure.material.table.unit.title'),
      // template: (props) => <UnitsCellTemplate {...props} options={units} onClick={onRowClick} />,
      // filterable: false,
      width: 150,
    },
    {
      id: 'actions',
      field: 'actions',
      title: translate('common.actions'),
      width: 75,
      // filterable: false,
      // template: (props) => (
      //   <ActionsCellTemplate
      //     {...props}
      //     isActive={true}
      //     onEdit={onEdit}
      //     onDelete={onDelete}
      //     onDiscard={onDiscard}
      //     onConfirm={onConfirm}
      //     onOpenQuickView={onOpenQuickView}
      //   />
      // ),
    },
  ];
};
