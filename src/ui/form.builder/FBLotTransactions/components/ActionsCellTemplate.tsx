import React from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import Actions, { ActionsProps } from '../../FBApprovalMatrixRoles/components/Actions';
import { EditableLotTransfer } from '../types';

interface Props extends CellTemplateProps<EditableLotTransfer>, ActionsProps<EditableLotTransfer> {}

const ActionsCell: React.FC<Props> = (props) => (
  <Actions
    scrollBehavior="smooth"
    {...props}
  />
);

export default ActionsCell;
