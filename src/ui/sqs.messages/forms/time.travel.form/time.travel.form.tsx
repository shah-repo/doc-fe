import { Box, Button, TextField } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { MomentFormats } from "../../../../common/utils/date";
// import {
//   TIME_ZONE,
// } from "../../../../common/utils/date";
import Text from "../../../components/Text";
import { styles } from "./time.travel.form.styles";

interface Props {
  handleTimeTravelFormSubmit: (selectedDate: string) => void;
}
const RecentsPresenter: React.FunctionComponent<Props> = ({
  handleTimeTravelFormSubmit,
}) => {
  const classes = styles();
  // const defaultDate = moment().tz(TIME_ZONE).format("YYYY-MM-DDTHH:mm");
  const defaultDate = moment().format(MomentFormats.DefaultDateTimeFormatter);
  const getUtcFormattedString = (date: string) =>
    moment(date, MomentFormats.DefaultDateTimeFormatter).toISOString();
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
          label={<Text translation="sqs.messages.time.travel" />}
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
            handleTimeTravelFormSubmit(selectedDate);
          }}
        >
          <Text translation={"common.submit"} />
        </Button>
      </Box>
    </Box>
  );
};
export default RecentsPresenter;
