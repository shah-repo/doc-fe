import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { find } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { changeRequestsSelectors } from '../../../../../state/ducks/changeRequest';
import { Autocomplete } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';

export const ByCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
  onClick,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const availableUsers = useSelector(changeRequestsSelectors.getUsersList);
  const getUserDetails = (userId: string) =>
    find(availableUsers, { value: userId });
  const [selectedUser, setSelectedUser] = useState(
    getUserDetails(dataItem[field] ?? ''),
  );
  const { setFieldValue } = useFormikContext<EditableLHRSummaryItem>();

  const handleChange = (event: React.ChangeEvent<{}>, value?: OptionType) => {
    if (!value?.value) {
      return;
    }
    setSelectedUser(value);
    setFieldValue(field, value?.value);
  };

  if (isEditMode) {
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
  }

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
