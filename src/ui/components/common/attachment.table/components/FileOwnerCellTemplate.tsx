import { Box } from '@material-ui/core';
import { get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../../state/ducks/auth';
import UserAvatar from '../../../../app/UserMenu/UserAvatar';
import { Attachment } from '../../../../change.request/form/types';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../KendoDataGrid/constants';
import { CellTemplateProps } from '../../../KendoDataGrid/KendoDataGrid.types';

const FileOwnerCellTemplate: React.FC<CellTemplateProps<Attachment>> = (props) => {
  const { dataItem, field } = props;
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;
  const initialColor = useSelector(authSelectors.getAvatarInitialColor);

  return (
    <Box display="flex">
      <UserAvatar
        avatar={dataItem?.owner?.user?.avatar ?? ''}
        name={dataItem?.owner?.user?.name ?? ''}
        {...{ initialColor }}
      />
      <Box alignSelf="center">
        {displayValue}
      </Box>
    </Box>
  );
};

export default FileOwnerCellTemplate;
