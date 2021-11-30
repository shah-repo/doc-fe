import { Box, Button, Grid, TextField } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import { toastError } from "../../../components/notifications";
import Text from "../../../components/Text";
import { TimeTravelProps } from "../../types";
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
