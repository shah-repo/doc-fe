import {
  Checkbox,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from '@material-ui/core';
import React, { useState } from 'react';
import Text from '../../components/Text';
import { styles } from '../grid/presenter.styles';
import {
  AsyncProps,
  NEXT_TASK_TYPES,
  NEXT_TASK_TYPES_USER,
  SQS_TYPES,
} from '../types';

const AsyncNextTask: React.FunctionComponent<AsyncProps> = ({
  setFieldValue,
  initialValues,
  type,
}) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const classes = styles();
  const [selected, setSelected] = useState<string[]>([]);
  let NEXT_TASK;
  if (type === SQS_TYPES.TIME_TRAVEL_COMPANY) {
    NEXT_TASK = NEXT_TASK_TYPES;
  } else {
    NEXT_TASK = NEXT_TASK_TYPES_USER;
  }
  const isAllSelected
    = NEXT_TASK.length > 0 && selected.length === NEXT_TASK.length;
  const handleChange = (event, setFieldValue) => {
    let value = event.target.value;
    if (value[value.length - 1] === 'all') {
      value = selected.length === NEXT_TASK.length ? [] : NEXT_TASK;
      setSelected(value);
      setFieldValue('nextTaskTypes', value);
      return;
    }
    setSelected(value);
    setFieldValue('nextTaskTypes', value);
  };
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Grid item={true} sm={4} data-cy="next.task" >
      <FormControl className={classes.formControl}>
        <InputLabel id="mutiple-select-label">
          <Text translation="async.task.next.task" />
        </InputLabel>
        <Select
          labelId="mutiple-select-label"
          multiple
          value={selected}
          defaultValue={initialValues.nextTaskTypes}
          onChange={(event) => handleChange(event, setFieldValue)}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          <MenuItem
            value="all"
            classes={{
              root: isAllSelected ? classes.selectedAll : '',
            }}
          >
            <ListItemIcon>
              <Checkbox
                classes={{
                  indeterminate: classes.indeterminateColor,
                }}
                checked={isAllSelected}
                indeterminate={
                  selected.length > 0 && selected.length < NEXT_TASK.length
                }
              />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.selectAllText }}
              primary={<Text translation="common.select.all" />}
            />
          </MenuItem>
          {NEXT_TASK.map((option) => (
            <MenuItem key={option} value={option}>
              <ListItemIcon>
                <Checkbox checked={selected.includes(option)} />
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};
export default AsyncNextTask;
