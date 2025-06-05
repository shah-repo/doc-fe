import { Checkbox } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import useStyles from './styles';

interface SelectFilterProps {
  rowCount: number
  numSelected: number
  handleHeaderCheckedChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const SelectFilter: React.FC<SelectFilterProps> = (props) => {
  const { handleHeaderCheckedChange, numSelected, rowCount } = props;
  const classes = useStyles();
  const isChecked = rowCount > 0 && numSelected === rowCount;
  const isIndeterminate = numSelected > 0 && numSelected < rowCount;

  return (
    <Checkbox
      className={classes.headerCheckbox}
      checked={isChecked}
      indeterminate={isIndeterminate}
      onChange={handleHeaderCheckedChange}
      inputProps={{ 'aria-label': translate('administration.bulk.migration.rev.grid.heading.selectAll') }}
    />
  );
};

export default SelectFilter;
