import { Box, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { SQSMessageActions } from "../../../src/state/ducks/sqs.messages";
import { MomentFormats } from "../../common/utils/date";
import {
  EffectiveDateFormValues, PasswordFormValues,
} from "../change.request/form/types";
import { toastError } from "../components/notifications";
import Text from "../components/Text";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import useDialog from "../hooks/useDialog";
import PasswordDialogueContainer from "./dialogs/PasswordDialogue";
import DateForm from "./forms/date.form/date.form";
import EmptyForm from "./forms/empty.form/empty.form";
import PasswordExpirationEmailSpecificForm from "./forms/password.expiration.email.specific/password.expiration.email.specific.form";
import PasswordExpirationForm from "./forms/password.expiration.form/password.expiration.form";
import TimeTravelForm from "./forms/time.travel.form/time.travel.form";
import UUIDBasedForm from "./forms/uuid.form/uuid.form";
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
  const [payload, setPayload] = React.useState("");
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as string);
  };
  const intl = useIntl();
  const executeAsyncTask = useActionCreator(SQSMessageActions.executeAsyncTask);
  const transitionDialog = useDialog();
  const async = useAsync({
    onSuccess: () => {
      closeApproveDialog();
      setType("");
    },
    onError: () => {
      closeApproveDialog();
      toastError(intl.formatMessage({ id: "common.sqs.task.failed" }));
    },
  });
  const openApproveDialog = () => {
    transitionDialog.open();
  };
  const closeApproveDialog = () => {
    transitionDialog.close();
  };
  const handleEmptyFormSubmit = () => {
    setPayload(JSON.stringify({
      password: "",
      taskType: type,
    }));
    openApproveDialog();
  };
  const handleDateFormSubmit = (selectedDate: string) => {
    setPayload(JSON.stringify(type === SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS ? {
      taskType: type,
      currentDate: selectedDate,
    } : {
      taskType: type,
      timestamp: selectedDate,
    }));
    openApproveDialog();
  };
  const handlePasswordExpirationFormSubmit = (data: any) => {
    setPayload(JSON.stringify({
      taskType: type,
      passwordUpdatedAt: data?.passwordUpdatedAt,
      passwordLastEmailSentAt: data?.passwordLastEmailSentAt,
      userEmails: data?.userEmails ? data.userEmails.split(",") : [],
    }));
    openApproveDialog();
  };
  const handlePasswordExpirationEmailSpecificFormSubmit = (data: any) => {
    setPayload(JSON.stringify({
      taskType: type,
      processedAtTimestamp: data?.processedAtTimestamp,
      userEmails: data?.userEmails ? data.userEmails.split(",") : [],
    }));
    openApproveDialog();
  };
  const handleuuidFormSubmit = (uuid: string) => {
    setPayload(JSON.stringify( type === SQS_TYPES.RECALC_COMPLIANCE_FOR_ON_EQ_RELEASE ? {
      taskType: type,
      docRevId: uuid,
    } : {
      taskType: type,
      formId: uuid,
    }));
    openApproveDialog();
  };
  const handleTimeTravelFormSubmit = (date: string) => {
    setPayload(JSON.stringify({
      taskType: type,
      timeTravel: {
        Year: moment(date, MomentFormats.DefaultDateTimeFormatter).year(),
        month: moment(date, MomentFormats.DefaultDateTimeFormatter).month(),
        day: moment(date, MomentFormats.DefaultDateTimeFormatter).days(),
        hour: moment(date, MomentFormats.DefaultDateTimeFormatter).hours(),
        minute: moment(date, MomentFormats.DefaultDateTimeFormatter).minutes(),
        second: moment(date, MomentFormats.DefaultDateTimeFormatter).seconds(),
      },
    }));
    openApproveDialog();
  };
  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    const updatedPayload = JSON.parse(payload);
    // eslint-disable-next-line no-console
    console.log("updatedPayload :::", updatedPayload);
    async.start(executeAsyncTask, { ...updatedPayload, ...values }, async);
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
        <EmptyForm {...{ handleEmptyFormSubmit }} key={type}/>
      )}
      {type &&
        [
          SQS_TYPES.TRAINING_RECORDS_STATUS,
          SQS_TYPES.TRAINING_RECORDS_REFRESH,
          SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS,
        ].includes(SQS_TYPES[type]) && (
        <DateForm {...{ handleDateFormSubmit }} key={type}/>
      )}
      {SQS_TYPES.UPDATE_USERS_AND_TEST_PASSWORD_EXPIRE === type && (
        <PasswordExpirationForm {...{ handlePasswordExpirationFormSubmit }} />
      )}
      {SQS_TYPES.SEND_PASSWORD_EXPIRATION_EMAILS_SPECIFIC === type && (
        <PasswordExpirationEmailSpecificForm key={type} {...{ handlePasswordExpirationEmailSpecificFormSubmit }} />
      )}
      {type &&
        [
          SQS_TYPES.RECALC_COMPLIANCE_FOR_ON_EQ_RELEASE,
          SQS_TYPES.SUPPLIER_IMPORT,
        ].includes(SQS_TYPES[type]) && (
        <UUIDBasedForm {...{ handleuuidFormSubmit, type }} key={type}/>
      )}
      {type &&
        [
          SQS_TYPES.TIME_TRAVEL_COMPANY,
          SQS_TYPES.TIME_TRAVEL_USER,
        ].includes(SQS_TYPES[type]) && (
        <TimeTravelForm {...{ handleTimeTravelFormSubmit }} key={type}/>
      )}
      <PasswordDialogueContainer
        transition="approve"
        asyncState={async.asyncState}
        onSubmit={onSubmit}
        transitionDialog={transitionDialog}
        label=""
      />
    </Box>
  );
};
export default RecentsPresenter;
