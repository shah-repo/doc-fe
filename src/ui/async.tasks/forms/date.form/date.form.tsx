import { Box, Button, TextField } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { MomentFormats } from '../../../../common/utils/date';
import Text from '../../../components/Text';
import { styles } from './date.form.styles';

interface Props {
  handleDateFormSubmit: (selectedDate: string) => void;
}
const DateFormAsyncTaskPresenter: React.FunctionComponent<Props> = ({
  handleDateFormSubmit,
}) => {
  const classes = styles();
  const defaultDate = moment().format(MomentFormats.AsyncTasksDefaultDateTimeFormatter);
  const getUtcFormattedString = (date: string) =>
    moment(date, MomentFormats.AsyncTasksDefaultDateTimeFormatter).toISOString();
  const [selectedDate, setSelectedDate] = React.useState(
    getUtcFormattedString(defaultDate)
  );
  const handleDateChange = (event: any) => {
    setSelectedDate(getUtcFormattedString(event?.target?.value));
  };
  return (
    <Box mt={2} className={classes.root}>
      <Box display="flex" justifyContent="flex-start">
        <TextField
          id="datetime-local"
          label={<Text translation="async.tasks.timestamp" />}
          type="datetime-local"
          defaultValue={defaultDate}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          onClick={() => {
            handleDateFormSubmit(selectedDate);
          }}
        >
          <Text translation={'common.submit'} />
        </Button>
      </Box>
    </Box>
  );
};
export default DateFormAsyncTaskPresenter;
