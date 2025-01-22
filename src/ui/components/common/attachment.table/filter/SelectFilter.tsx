import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { Checkbox } from '@progress/kendo-react-inputs';
import React from 'react';

const styles = makeStyles((theme: Theme) =>
  createStyles({
    headerCheckbox: {
      marginLeft: theme.spacing(1),
    },
  }));

const SelectFilter: React.FC<any> = (props) => {
  const {
    headerChecked,
    handleHeaderCheckedChange,
  } = props;
  const classes = styles();

  return (
      <Checkbox
        className={classes.headerCheckbox}
        checked={headerChecked}
        onChange={handleHeaderCheckedChange}
      />
  );
};

export default SelectFilter;
