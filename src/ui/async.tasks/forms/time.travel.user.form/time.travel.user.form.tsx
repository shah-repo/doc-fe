import { Box, Button, Grid } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';
import { timeTravelValidator } from '../../../components/forms/fields/validators';
import { toastError } from '../../../components/notifications';
import Text from '../../../components/Text';
import { SQS_TYPES, TimeTravelProps } from '../../types';
import AsyncNextTask from '../async.next.task';
import AsyncTime from '../async.time';
import { styles } from './time.travel.user.form.styles';

interface Props {
  handleTimeTravelUser: (values: TimeTravelProps) => void;
}
const TimeTravelUser: React.FunctionComponent<Props> = ({
  handleTimeTravelUser,
}) => {
  const classes = styles();
  const intl = useIntl();
  const initialValues = {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    nextTaskTypes: [],
  };
  const handleSubmit = (values: TimeTravelProps) => {
    const isAllValuesAreEmpty = !Object.values(values).some(
      (fieldValue) => +fieldValue > 0
    );
    if (!isAllValuesAreEmpty) {
      handleTimeTravelUser(values);
      return;
    }
    toastError(intl.formatMessage({ id: 'async.task.timetravel.error' }));
  };

  return (
    <Box mt={2} className={classes.root}>
      <Formik
        initialValues={initialValues}
        validationSchema={timeTravelValidator}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ errors, setFieldValue, initialValues }) => (
          <Form>
            <Box display="flex" justifyContent="flex-start">
              <Grid container={true} className={classes.grid} spacing={2}>
                <AsyncTime
                  initialValues={initialValues}
                  setFieldValue={setFieldValue}
                  errors={errors}
                />
                <AsyncNextTask
                  setFieldValue={setFieldValue}
                  initialValues={initialValues}
                  errors={errors}
                  type={SQS_TYPES.TIME_TRAVEL_USER}
                />
              </Grid>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button type="submit" variant="contained" color="secondary">
                <Text translation={'common.submit'} />
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
export default TimeTravelUser;
