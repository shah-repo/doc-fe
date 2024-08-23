import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { find } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { changeRequestsSelectors } from '../../../../state/ducks/changeRequest';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { CustomTemplateProps, EditableReference } from '../types';

export const OwnerCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
  onClick,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const formik = useFormikContext<EditableReference>();
  const availableUsers = useSelector(changeRequestsSelectors.getUsersList);
  const fieldValue = isEditMode ? formik?.values[field] || dataItem[field] : dataItem[field];
  const getUserDetails = (userId: string) => find(availableUsers, { value: userId });
  const user = getUserDetails(fieldValue ?? '');
  const label = user?.label;

  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <OverflowTooltip title={label} placement="top" interactive arrow>
        {label}
      </OverflowTooltip>
    </Box>
  );
};
