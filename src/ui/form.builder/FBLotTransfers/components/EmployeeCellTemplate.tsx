import { Box } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../state/ducks/auth';
import { Employee } from '../../../../state/ducks/company/types';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { Autocomplete } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';

interface Props extends CustomTemplateProps {
  options: Employee[]
}

export const EmployeeCellTemplate: React.FC<Props> = ({ dataItem, options, onClick }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const userName = useSelector(authSelectors.currentUserName);

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

  const employeeName = options.find(employee => employee.id === dataItem.by)?.user?.name;
  const displayValue = employeeName ?? EMPTY_VALUE_PLACEHOLDER;

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
