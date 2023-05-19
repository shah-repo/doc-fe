import { Box, Button, Grid, TextField } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { MomentFormats } from '../../../../common/utils/date';
import Text from '../../../components/Text';
import { styles } from './password.expiration.email.specific.form.styles';

interface Props {
  handlePasswordExpirationEmailSpecificFormSubmit: ( { processedAtTimestamp, userEmails } ) => void;
}
const PasswordExpirationEmailSpecificAsyncTaskPresenter: React.FunctionComponent<Props> = ({
  handlePasswordExpirationEmailSpecificFormSubmit,
}) => {
  const classes = styles();
  const defaultDate = moment().format(MomentFormats.AsyncTasksDefaultDateTimeFormatter);
  const getUtcFormattedString = (date: string) =>
    moment(date, MomentFormats.AsyncTasksDefaultDateTimeFormatter).toISOString();
  const [processedAtTimestamp, setProcessedAtTimestamp] = React.useState(
    getUtcFormattedString(defaultDate)
  );
  const [userEmails, setUserEmails] = React.useState('');
  const handlePasswordUpdatedDateChange = (event: any) => {
    setProcessedAtTimestamp(getUtcFormattedString(event?.target?.value));
  };
  const handleUserEmailsChange = (event: any) => {
    setUserEmails(event?.target?.value);
  };
  return (
    <Box mt={2} className={classes.root}>
      <Grid container={true} spacing={0}>
        <Grid item={true} sm={12} className={classes.mt8}>
          <TextField
            id="datetime-local"
            label={<Text translation="async.tasks.password.update" />}
            type="datetime-local"
            defaultValue={defaultDate}
            onChange={handlePasswordUpdatedDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item={true} sm={12} className={classes.mt8}>
          <TextField
            id="filled-textarea"
            label={<Text translation="async.tasks.user.emails" />}
            multiline
            onChange={handleUserEmailsChange}
            value={userEmails}
            variant="filled"
          />
        </Grid>
      </Grid>
      <Box mt={1} display="flex" justifyContent="flex-end">
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          onClick={() => {
            handlePasswordExpirationEmailSpecificFormSubmit({ ...{ processedAtTimestamp, userEmails } });
          }}
        >
          <Text translation={'common.submit'} />
        </Button>
      </Box>
    </Box>
  );
};
export default PasswordExpirationEmailSpecificAsyncTaskPresenter;
