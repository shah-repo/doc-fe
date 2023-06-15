import React from 'react';
import Actions, { ActionsProps } from '../../FBApprovalMatrixRoles/components/Actions';
import { CustomTemplateProps, EditableLotTransfer } from '../types';

interface Props extends CustomTemplateProps, ActionsProps<EditableLotTransfer> {}

export const ActionsCellTemplate: React.FC<Props> = (props) => (
  <Actions
    scrollBehavior="smooth"
    {...props}
  />
);
