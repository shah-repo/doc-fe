import { Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Checkbox, CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import React from 'react';

const styles = makeStyles((theme: Theme) => createStyles({
  headerCheckbox: {
    marginLeft: theme.spacing(1),
  },
}));

interface Props {
  isHeaderChecked: boolean
  handleHeaderCheckedChange: (event: CheckboxChangeEvent) => void
}

const SelectFilter: React.FC<Props> = (props) => {
  const { isHeaderChecked, handleHeaderCheckedChange } = props;
  const classes = styles();

  return (
    <Checkbox
      className={classes.headerCheckbox}
      checked={isHeaderChecked}
      onChange={handleHeaderCheckedChange}
    />
  );
};

export default SelectFilter;
