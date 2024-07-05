import React from 'react';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import Actions, { ActionsProps } from '../../../../../form.builder/FBApprovalMatrixRoles/components/Actions';
import { EditableCompanyLocation } from '../../../panels/CompanyLocations/types';

type Props = CellTemplateProps<EditableCompanyLocation> | ActionsProps;

const EquipmentActionsCellTemplate: React.FC<Props> = (props) => (
  <Actions
    scrollBehavior="smooth"
    {...props}
  />
);

export default EquipmentActionsCellTemplate;
