import React from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { EditableRole } from '../types';
import Actions, { ActionsProps } from './Actions';

type Props = CellTemplateProps<EditableRole> & ActionsProps;

const ActionsCell: React.FC<Props> = (props) => (
  <Actions
    scrollBehavior="smooth"
    {...props}
  />
);

export default ActionsCell;
