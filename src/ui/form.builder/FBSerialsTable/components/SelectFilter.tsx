import { Checkbox, CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import React from 'react';
import useStyles from '../styles';

interface Props {
  isChecked: boolean
  onCheck: (event: CheckboxChangeEvent) => void
}

const SelectFilter: React.FC<Props> = (props) => {
  const { isChecked, onCheck } = props;
  const classes = useStyles();

  return (
    <Checkbox
      className={classes.headerCheckbox}
      checked={isChecked}
      onChange={onCheck}
    />
  );
};

export default SelectFilter;
