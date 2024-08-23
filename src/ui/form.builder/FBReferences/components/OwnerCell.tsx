import { Box } from '@material-ui/core';
import { find } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { changeRequestsSelectors } from '../../../../state/ducks/changeRequest';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { CustomTemplateProps } from '../types';

export const OwnerCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
  onClick,
}) => {
  const availableUsers = useSelector(changeRequestsSelectors.getUsersList);
  const getUserDetails = (userId: string) => find(availableUsers, { value: userId });
  const user = getUserDetails(dataItem[field] ?? '');
  const label = user?.label;

  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <OverflowTooltip title={label} placement="top" interactive arrow>
        {label}
      </OverflowTooltip>
    </Box>
  );
};
