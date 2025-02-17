import { Checkbox, CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import React from 'react';
import { useStyles } from '../styles';

interface Props {
  isHeaderChecked: boolean
  handleHeaderCheckedChange: (event: CheckboxChangeEvent) => void
}

const SelectFilter: React.FC<Props> = (props) => {
  const { isHeaderChecked, handleHeaderCheckedChange } = props;
  const classes = useStyles();

  return (
    <Checkbox
      className={classes.headerCheckbox}
      checked={isHeaderChecked}
      onChange={handleHeaderCheckedChange}
    />
  );
};

export default SelectFilter;
