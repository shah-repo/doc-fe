import { Box, Button, Grid, TextField } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { MomentFormats } from "../../../../common/utils/date";
import Text from "../../../components/Text";
import { styles } from "./password.expiration.email.specific.form.styles";

interface Props {
  handlePasswordExpirationEmailSpecificFormSubmit: ( { processedAtTimestamp, userEmails } ) => void;
}
const RecentsPresenter: React.FunctionComponent<Props> = ({
  handlePasswordExpirationEmailSpecificFormSubmit,
}) => {
  const classes = styles();
  // const defaultDate = moment().tz(TIME_ZONE).format("YYYY-MM-DDTHH:mm");
  const defaultDate = moment().format(MomentFormats.DefaultDateTimeFormatter);
  const getUtcFormattedString = (date: string) =>
    moment(date, MomentFormats.DefaultDateTimeFormatter).toISOString();
  const [processedAtTimestamp, setProcessedAtTimestamp] = React.useState(
    getUtcFormattedString(defaultDate)
  );
  const [userEmails, setUserEmails] = React.useState("");
  const handlePasswordUpdatedDateChange = (event: any) => {
    setProcessedAtTimestamp(getUtcFormattedString(event?.target?.value));
  };
  const handleUserEmailsChange = (event: any) => {
    setUserEmails(event?.target?.value);
  };
  // const reset = () => {
  //   setProcessedAtTimestamp(getUtcFormattedString(defaultDate));
  // };
  return (
    <Box mt={2} className={classes.root}>
      {/* <Box display="flex"> */}
      <Grid container={true} spacing={0}>
        <Grid item={true} sm={12} className={classes.mt8}>
          <TextField
            fullWidth
            id="datetime-local"
            label={<Text translation="sqs.messages.password.update" />}
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
            fullWidth
            label={<Text translation="sqs.messages.user.emails" />}
            multiline
            onChange={handleUserEmailsChange}
            value={userEmails}
            variant="filled"
          />
        </Grid>
      </Grid>
      {/* </Box> */}
      <Box mt={1} display="flex" justifyContent="flex-end">
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          onClick={() => {
            handlePasswordExpirationEmailSpecificFormSubmit({ ...{ processedAtTimestamp, userEmails } });
          }}
        >
          <Text translation={"common.submit"} />
        </Button>
        {/* <Button variant="contained" onClick={reset}>
          <Text translation={"common.reset"} />
        </Button> */}
      </Box>
    </Box>
  );
};
export default RecentsPresenter;
