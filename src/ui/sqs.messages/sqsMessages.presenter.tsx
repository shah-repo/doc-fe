import { Box, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import Text from "../components/Text";
import DateForm from "./forms/date.form/date.form";
import EmptyForm from "./forms/empty.form/empty.form";
import { styles } from "./sqsMessages.styles";
import { SQS_TYPES } from "./types";

const RecentsPresenter: React.FunctionComponent = () => {
  const classes = styles();
  const dropDownOptions = [
    { value: "TIME_TRAVEL_USER", text: "TIME_TRAVEL_USER" },
    { value: "TIME_TRAVEL_COMPANY", text: "TIME_TRAVEL_COMPANY" },
    { value: "UPDATE_USERS_AND_TEST_PASSWORD_EXPIRE", text: "UPDATE_USERS_AND_TEST_PASSWORD_EXPIRE" },
    { value: "RECALC_COMPLIANCE_FOR_ON_EQ_RELEASE", text: "RECALC_COMPLIANCE_FOR_ON_EQ_RELEASE" },
    { value: "SUPPLIER_IMPORT", text: "SUPPLIER_IMPORT" },
    { value: "DEACTIVATE_PROD2_USERS", text: "DEACTIVATE_PROD2_USERS" },
    { value: "RECALC_COMPLIANCE_FOR_EQUIPMENTS", text: "RECALC_COMPLIANCE_FOR_EQUIPMENTS" },
    { value: "SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS", text: "SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS" },
    { value: "SEND_PASSWORD_EXPIRATION_EMAILS_SPECIFIC", text: "SEND_PASSWORD_EXPIRATION_EMAILS_SPECIFIC" },
    { value: "RECALC_GROUP_TO_EMPLOYEE_ALL_COMPANIES", text: "RECALC_GROUP_TO_EMPLOYEE_ALL_COMPANIES" },
    { value: "TRAINING_RECORDS_REFRESH", text: "TRAINING_RECORDS_REFRESH"  },
    { value: "TRAINING_RECORDS_STATUS", text: "TRAINING_RECORDS_STATUS" },
    { value: "UPDATE_BILLS", text: "UPDATE_BILLS" },
  ];
  const [type, setType] = React.useState("");
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as string);
  };
  const handleEmptyFormSubmit = () => {
    const payload = {
      taskType: type,
    };
    // eslint-disable-next-line no-console
    console.log("Payload :::", payload);
  };
  const handleDateFormSubmit = (selectedDate: string) => {
    const payload = {
      taskType: type,
      timestamp: selectedDate,
    };
    // eslint-disable-next-line no-console
    console.log("Payload :::", payload);
  };
  return (
    <Box m={4} className={classes.root}>
      <FormControl style={{ minWidth: 200 }}>
        <InputLabel id="sqs-messages-type-select-outlined-label">
          <Text translation="sqs.messages.type" />
        </InputLabel>
        <Select
          labelId="sqs-messages-type-select-outlined-label"
          id="sqs-messages-type-select-outlined"
          value={type}
          onChange={handleChange}
        >
          {dropDownOptions.map((data, index) => (
            <MenuItem key={data.value} value={data.text}>
              {data.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {type &&
        [
          SQS_TYPES.UPDATE_BILLS,
          SQS_TYPES.RECALC_GROUP_TO_EMPLOYEE_ALL_COMPANIES,
          SQS_TYPES.DEACTIVATE_PROD2_USERS,
          SQS_TYPES.RECALC_COMPLIANCE_FOR_EQUIPMENTS,
        ].includes(SQS_TYPES[type]) && (
        <EmptyForm {...{ handleEmptyFormSubmit }} />
      )}
      {type &&
        [
          SQS_TYPES.TRAINING_RECORDS_STATUS,
          SQS_TYPES.TRAINING_RECORDS_REFRESH,
          SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS,
        ].includes(SQS_TYPES[type]) && (
        <DateForm {...{ handleDateFormSubmit }} />
      )}
    </Box>
  );
};
export default RecentsPresenter;
