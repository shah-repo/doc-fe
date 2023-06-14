import React from 'react';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import Actions, { ActionsProps } from '../../../../form.builder/FBApprovalMatrixRoles/components/Actions';
import { EditableCompanyLocation } from '../types';

interface Props extends CellTemplateProps<EditableCompanyLocation>, ActionsProps<EditableCompanyLocation> {}

const ActionsCellTemplate: React.FC<Props> = (props) => (
  <Actions
    scrollBehavior="smooth"
    {...props}
  />
);

export default ActionsCellTemplate;
