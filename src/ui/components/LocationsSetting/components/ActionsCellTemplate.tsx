import React from 'react';
import { CellTemplateProps } from '../../KendoDataGrid/KendoDataGrid.types';
import Actions, { ActionsProps } from '../../../form.builder/FBApprovalMatrixRoles/components/Actions';
import { EditableCompanyLocation } from '../../../user.management/profile/CompanyLocations/types';

type Props = CellTemplateProps<EditableCompanyLocation> & ActionsProps;

const ActionsCellTemplate: React.FC<Props> = (props) => (
  <Actions
    scrollBehavior="smooth"
    {...props}
  />
);

export default ActionsCellTemplate;
