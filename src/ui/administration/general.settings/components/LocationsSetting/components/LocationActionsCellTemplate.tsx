import { GridCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { CellTemplateProps, DataGridRowClickEvent } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { EditableCompanyLocation } from '../../../panels/CompanyLocations/types';
import Actions from './Actions';

export type ActionsProps = CellTemplateProps<EditableCompanyLocation> & GridCellProps & {
  onConfirm: () => void
  onDiscard: () => void
  onDelete: () => void
  onClick?: (e: DataGridRowClickEvent<EditableCompanyLocation>) => void
  scrollBehavior?: ScrollBehavior
  isActive: boolean
};

const LocationActionsCellTemplate: React.FC<ActionsProps> = (props) => (
  <Actions
    scrollBehavior="smooth"
    {...props}
  />
);

export default LocationActionsCellTemplate;
