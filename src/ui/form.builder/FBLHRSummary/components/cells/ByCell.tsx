import { Box } from '@material-ui/core';
import { find } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../../state/ducks/auth';
import { changeRequestsSelectors } from '../../../../../state/ducks/changeRequest';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { Autocomplete } from '../../../../components/forms/fields-next';
import { CustomTemplateProps } from '../../types';

export const ByCell: React.FC<CustomTemplateProps> = ({ dataItem, field, onClick }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const userName = useSelector(authSelectors.currentUserName);
  const availableUsers = useSelector(changeRequestsSelectors.getUsersList);
  const getUserDetails = (userId: string) => find(availableUsers, { value: userId });

  if (isEditMode) {
    return (
      <Autocomplete
        options={[userName]}
        value={userName}
        size="small"
        disabled
      />
    );
  }

  const displayValue = getUserDetails(dataItem[field] ?? '')?.label as string;

  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <OverflowTooltip
        title={displayValue}
        placement="top"
        interactive
        arrow
      >
        {displayValue}
      </OverflowTooltip>
    </Box>
  );
};
