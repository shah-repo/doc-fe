import { Box } from '@material-ui/core';
import { get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../../state/ducks/auth';
import UserAvatar from '../../../../app/UserMenu/UserAvatar';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../KendoDataGrid/constants';

const FileOwnerCellTemplate: React.FC<any> = (props) => {
  const { dataItem, field } = props;
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;
  const initialColor = useSelector(authSelectors.getAvatarInitialColor);

  return (
    <Box display="flex">
      <UserAvatar
        avatar={dataItem?.owner?.user?.avatar}
        name={dataItem?.owner?.user?.name}
        {...{ initialColor }} />
      {displayValue}
    </Box>
  );
};

export default FileOwnerCellTemplate;
