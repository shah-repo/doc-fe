import { Box } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import React from 'react';
import FBText from '../FBText/FBText';

interface Props {
  groupName: string
  key: number
  checked?: boolean
}

const ApprovalApprovedGroup: React.FC<Props> = ({
  groupName,
  key,
  checked,
}) => (
  <Box display="flex" key={`fb-approvers-group-${key}`} mr={2.5}>
    <CheckCircleIcon color={checked ? 'primary' : 'disabled'} />
    <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={groupName} />
  </Box>
);

export default ApprovalApprovedGroup;
