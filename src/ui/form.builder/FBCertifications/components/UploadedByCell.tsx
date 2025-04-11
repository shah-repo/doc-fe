import { Box } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { changeRequestsSelectors } from '../../../../state/ducks/changeRequest';
import { ApplicationState } from '../../../../state/reducers';
import { store } from '../../../../state/store';
import { AvatarComponent } from '../../../components/common/kendo.column.templates/UserAvatar';
import { CustomTemplateProps } from '../types';

export const UploadedByCell: React.FC<CustomTemplateProps> = ({ dataItem, field, onClick }) => {
  const { id } = store.getState().auth.user ?? {};
  const selectedUserInfo = useSelector((state: ApplicationState) => changeRequestsSelectors.getUserInfoById(state, id));

  if (!selectedUserInfo) {
    return null;
  }

  const { name, avatar, initialColor } = selectedUserInfo;
  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <AvatarComponent {...{ name, avatar, initialColor }} />
    </Box>
  );
};
