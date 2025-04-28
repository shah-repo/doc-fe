import { Checkbox } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import { styles as useStyles } from './styles';

interface Props {
  rowCount: number
  numSelected: number
  handleHeaderCheckedChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const SelectFilter: React.FC<Props> = (props) => {
  const { handleHeaderCheckedChange, numSelected, rowCount } = props;
  const classes = useStyles();

  return (
    <Checkbox
      className={classes.headerCheckbox}
      checked={rowCount > 0 && numSelected === rowCount}
      indeterminate={numSelected > 0 && numSelected < rowCount}
      onChange={handleHeaderCheckedChange}
      inputProps={{ 'aria-label': translate('administration.bulk.migration.rev.grid.heading.selectAll') }}
    />
  );
};

export default SelectFilter;
