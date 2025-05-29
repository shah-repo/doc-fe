import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import { changeRequestsSelectors } from '../../../../state/ducks/changeRequest';
import { ApplicationState } from '../../../../state/reducers';
import { store } from '../../../../state/store';
import { AvatarComponent } from '../../../components/common/kendo.column.templates/UserAvatar';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { CustomTemplateProps, EditableCertification } from '../types';

export const UploadedByCell: React.FC<CustomTemplateProps> = ({ dataItem, field, onClick }) => {
  const isAddition = dataItem[MODE_FIELD] === Mode.add;
  const { id: currentUserId } = store.getState().auth.user ?? {};
  const selectedUserInfo = useSelector((state: ApplicationState) => changeRequestsSelectors.getUserInfoById(state, isAddition ? currentUserId : dataItem[field]));

  if (!selectedUserInfo) {
    return null;
  }

  const { name, avatar, initialColor } = selectedUserInfo;
  const formik = useFormikContext<EditableCertification>();
  if (isAddition && formik && formik.values?.[field] !== selectedUserInfo?.id) {
    formik.setFieldValue(field, selectedUserInfo?.id);
    formik.setFieldValue('uploadedByName', name);
  }

  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <AvatarComponent {...{ name, avatar, initialColor }} />
    </Box>
  );
};
