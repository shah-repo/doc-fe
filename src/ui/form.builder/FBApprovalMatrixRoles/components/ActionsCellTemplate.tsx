import React from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { EditableRole } from '../types';
import Actions, { ActionsProps } from './Actions';

interface Props extends CellTemplateProps<EditableRole>, ActionsProps<EditableRole> {}

const ActionsCell: React.FC<Props> = (props) => (
  <Actions
    scrollBehavior="smooth"
    {...props}
  />
);

export default ActionsCell;
