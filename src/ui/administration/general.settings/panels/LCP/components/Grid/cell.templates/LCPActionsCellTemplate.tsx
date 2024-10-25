import { GridCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { CustomGroupOptions, EditableLCP } from '../types';
import Actions from './Actions';

export type ActionsProps = CellTemplateProps<EditableLCP> & GridCellProps & {
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: () => void
  scrollBehavior?: ScrollBehavior
  selectedPartGroups: CustomGroupOptions[]
};

const LocationActionsCellTemplate: React.FC<ActionsProps> = (props) => (
  <Actions
    scrollBehavior="smooth"
    {...props}
  />
);

export default LocationActionsCellTemplate;
