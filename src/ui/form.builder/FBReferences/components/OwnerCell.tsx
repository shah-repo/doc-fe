import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { find } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { changeRequestsSelectors } from '../../../../state/ducks/changeRequest';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { Autocomplete } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { CustomTemplateProps, EditableReference } from '../types';

export const OwnerCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
  onClick,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const availableUsers = useSelector(changeRequestsSelectors.getUsersList);
  const getUserDetails = (userId: string) => find(availableUsers, { value: userId });
  const user = getUserDetails(dataItem[field] ?? '');
  const [selectedUser, setSelectedUser] = useState(user ?? '');
  const label = user?.label;

  if (!isEditMode) {
    return (
      <Box onClick={() => onClick?.({ dataItem })}>
        <OverflowTooltip title={label} placement="top" interactive arrow>
          {label}
        </OverflowTooltip>
      </Box>
    );
  }

  const { setFieldValue } = useFormikContext<EditableReference>();
  const handleChange = (event: React.ChangeEvent<{}>, value?: OptionType) => {
    if (!value?.value) {
      return;
    }
    setSelectedUser(value);
    setFieldValue(field, value?.value);
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
