import { Box, Grid, TextField } from '@material-ui/core';
import React from 'react';
import Text from '../../components/Text';
import { styles } from '../grid/presenter.styles';
import { AsyncProps } from '../types';

const AsyncTime: React.FunctionComponent<AsyncProps> = ({
  initialValues,
  setFieldValue,
  errors,
}) => {
  const classes = styles();

  return (
    <Box mt={2} className={classes.root}>
      <Grid container className={classes.formControl}>
        <Grid item={true} sm={4}>
          <TextField
            type="number"
            name="year"
            label={<Text translation="async.tasks.year" />}
            defaultValue={initialValues.year}
            onChange={(event) => setFieldValue('year', +event.target.value)}
            variant="outlined"
            helperText={<span className={classes.error}>{errors.year}</span>}
          />
        </Grid>
        <Grid item={true} sm={4}>
          <TextField
            type="number"
            name="month"
            label={<Text translation="async.tasks.month" />}
            defaultValue={initialValues.month}
            onChange={(event) => setFieldValue('month', +event.target.value)}
            variant="outlined"
            helperText={<span className={classes.error}>{errors.month}</span>}
          />
        </Grid>
        <Grid item={true} sm={4}>
          <TextField
            type="number"
            name="day"
            label={<Text translation="async.tasks.day" />}
            defaultValue={initialValues.day}
            onChange={(event) => setFieldValue('day', +event.target.value)}
            variant="outlined"
            helperText={<span className={classes.error}>{errors.day}</span>}
          />
        </Grid>
        <Grid item={true} sm={4}>
          <TextField
            type="number"
            name="hour"
            label={<Text translation="async.tasks.hour" />}
            defaultValue={initialValues.hour}
            onChange={(event) => setFieldValue('hour', +event.target.value)}
            variant="outlined"
            helperText={<span className={classes.error}>{errors.hour}</span>}
          />
        </Grid>
        <Grid item={true} sm={4}>
          <TextField
            type="number"
            name="minute"
            label={<Text translation="async.tasks.minute" />}
            defaultValue={initialValues.minute}
            onChange={(event) => setFieldValue('minute', +event.target.value)}
            variant="outlined"
            helperText={<span className={classes.error}>{errors.minute}</span>}
          />
        </Grid>
        <Grid item={true} sm={4}>
          <TextField
            type="number"
            name="second"
            label={<Text translation="async.tasks.second" />}
            defaultValue={initialValues.second}
            variant="outlined"
            onChange={(event) => setFieldValue('second', +event.target.value)}
            helperText={<span className={classes.error}>{errors.second}</span>}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default AsyncTime;
