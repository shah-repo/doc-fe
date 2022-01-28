import { Box, Button, Checkbox, Chip, FormControl, Grid, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, TextField } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import { toastError } from "../../../components/notifications";
import Text from "../../../components/Text";
import { NEXT_TASK_TYPES, TimeTravelProps } from "../../types";
import { styles } from "./time.travel.form.styles";

interface Props {
  handleTimeTravelFormSubmit: (values: TimeTravelProps) => void;
}
const RecentsPresenter: React.FunctionComponent<Props> = ({
  handleTimeTravelFormSubmit,
}) => {
  const classes = styles();
  const DisplayingErrorMessagesSchema = Yup.object().shape({
    year: Yup.string()
      .required()
      .matches(/^[0-9]+$/, "Should be greather than 0"),
    month: Yup.string()
      .required()
      .matches(/^[0-9]+$/, "Should be greather than 0"),
    day: Yup.string()
      .required()
      .matches(/^[0-9]+$/, "Should be greather than 0"),
    hour: Yup.string()
      .required()
      .matches(/^[0-9]+$/, "Should be greather than 0"),
    minute: Yup.string()
      .required()
      .matches(/^[0-9]+$/, "Should be greather than 0"),
    second: Yup.string()
      .required()
      .matches(/^[0-9]+$/, "Should be greather than 0"),
  });
  const intl = useIntl();
  const [selected, setSelected] = useState<string[]>([]);
  const isAllSelected =
  NEXT_TASK_TYPES.length > 0 && selected.length === NEXT_TASK_TYPES.length;
  const handleChange = (event, setFieldValue) => {
    let value = event.target.value;
    if (value[value.length - 1] === "all") {
      value = selected.length === NEXT_TASK_TYPES.length ? [] : NEXT_TASK_TYPES;
      setSelected(value);
      setFieldValue("nextTaskTypes", value);
      return;
    }
    setSelected(value);
    setFieldValue("nextTaskTypes", value);
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Box mt={2} className={classes.root}>
      <Formik
        initialValues={{
          year: 0,
          month: 0,
          day: 0,
          hour: 0,
          minute: 0,
          second: 0,
          nextTaskTypes: selected,
        }}
        validationSchema={DisplayingErrorMessagesSchema}
        onSubmit={(values) => {
          const isAllValuesAreEmpty = !Object.values(values).some((fieldValue) => +fieldValue > 0);
          if (isAllValuesAreEmpty) {
            toastError(intl.formatMessage({ id: "async.task.timetravel.error" }));
          } else {
            handleTimeTravelFormSubmit(values);
          }
        }}
      >
        {({ errors, touched, setFieldValue, initialValues }) => (
          <Form>
            <Box display="flex" justifyContent="flex-start">
              <Grid container={true} className={classes.grid} spacing={2}>
                <Grid item={true} sm={4}>
                  <TextField
                    type="number"
                    name="year"
                    label={<Text translation="async.tasks.year"/>}
                    defaultValue={initialValues.year}
                    onChange={(event) => setFieldValue("year", +event.target.value)}
                    variant="outlined"
                    helperText={
                      <>
                        <span className={classes.error}>{errors.year}</span>
                      </>
                    }
                  />
                </Grid>
                <Grid item={true} sm={4}>
                  <TextField
                    type="number"
                    name="month"
                    label={<Text translation="async.tasks.month"/>}
                    defaultValue={initialValues.month}
                    onChange={(event) => setFieldValue("month", +event.target.value)}
                    variant="outlined"
                    helperText={
                      <>
                        <span className={classes.error}>{errors.month}</span>
                      </>
                    }
                  />
                </Grid>
                <Grid item={true} sm={4}>
                  <TextField
                    type="number"
                    name="day"
                    label={<Text translation="async.tasks.day"/>}
                    defaultValue={initialValues.day}
                    onChange={(event) => setFieldValue("day", +event.target.value)}
                    variant="outlined"
                    helperText={
                      <>
                        <span className={classes.error}>{errors.day}</span>
                      </>
                    }
                  />
                </Grid>
                <Grid item={true} sm={4}>
                  <TextField
                    type="number"
                    name="hour"
                    label={<Text translation="async.tasks.hour"/>}
                    defaultValue={initialValues.hour}
                    onChange={(event) => setFieldValue("hour", +event.target.value)}
                    variant="outlined"
                    helperText={
                      <>
                        <span className={classes.error}>{errors.hour}</span>
                      </>
                    }
                  />
                </Grid>
                <Grid item={true} sm={4}>
                  <TextField
                    type="number"
                    name="minute"
                    label={<Text translation="async.tasks.minute"/>}
                    defaultValue={initialValues.minute}
                    onChange={(event) => setFieldValue("minute", +event.target.value)}
                    variant="outlined"
                    helperText={
                      <>
                        <span className={classes.error}>{errors.minute}</span>
                      </>
                    }
                  />
                </Grid>
                <Grid item={true} sm={4}>
                  <TextField
                    type="number"
                    name="second"
                    label={<Text translation="async.tasks.second"/>}
                    defaultValue={initialValues.second}
                    variant="outlined"
                    onChange={(event) => setFieldValue("second", +event.target.value)}
                    helperText={
                      <>
                        <span className={classes.error}>{errors.second}</span>
                      </>
                    }
                  />
                </Grid>
                <Grid item={true} sm={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="mutiple-select-label">Next Task</InputLabel>
                    <Select
                      labelId="mutiple-select-label"
                      multiple
                      value={selected}
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
                          root: isAllSelected ? classes.selectedAll : "",
                        }}
                      >
                        <ListItemIcon>
                          <Checkbox
                            classes={{ indeterminate: classes.indeterminateColor }}
                            checked={isAllSelected}
                            indeterminate={
                              selected.length > 0 && selected.length < NEXT_TASK_TYPES.length
                            }
                          />
                        </ListItemIcon>
                        <ListItemText
                          classes={{ primary: classes.selectAllText }}
                          primary="Select All"
                        />
                      </MenuItem>
                      {NEXT_TASK_TYPES.map((option) => (
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
              </Grid>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button type="submit" variant="contained" color="secondary">
                <Text translation={"common.submit"} />
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
export default RecentsPresenter;
