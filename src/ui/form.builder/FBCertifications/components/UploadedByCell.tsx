import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { find } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { changeRequestsSelectors } from '../../../../state/ducks/changeRequest';
import { ApplicationState } from '../../../../state/reducers';
import { AvatarComponent } from '../../../components/common/kendo.column.templates/UserAvatar';
import { Autocomplete } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { CustomTemplateProps, EditableCertification } from '../types';

export const UploadedByCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
  onClick,
}) => {
  const availableUsers = useSelector(changeRequestsSelectors.getUsersList);
  const getUserDetails = (userId: string) => find(availableUsers, { value: userId });
  const user = useMemo(() => getUserDetails(dataItem[field] ?? ''), [dataItem, field]);
  const [selectedUser, setSelectedUser] = useState(() => user ?? '');
  const isViewMode = ![Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const selectedUserInfo = useSelector((state: ApplicationState) =>
    changeRequestsSelectors.getUserInfoById(state, user?.value),
  );

  if (isViewMode) {
    if (!selectedUserInfo) {
      return null;
    }

    const { name, avatar, initialColor } = selectedUserInfo;
    return (
      <Box onClick={() => onClick?.({ dataItem })}>
        <AvatarComponent {...{ name, avatar, initialColor }} />
      </Box>
    );
  }

  const { setFieldValue } = useFormikContext<EditableCertification>();
  const handleChange = (_, value?: OptionType) => {
    if (!value?.value) {
      return;
    }
    setSelectedUser(value);
    setFieldValue(field, value?.value);
    setFieldValue('uploadedByName', value?.label);
  };

  return (
    <Autocomplete
      options={availableUsers}
      defaultValue={selectedUser}
      onChange={handleChange}
      blurOnSelect
      getOptionLabel={(option: OptionType) => option.label}
      size="small"
    />
  );
};
