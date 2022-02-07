import { FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { AsyncTaskActions } from "../../state/ducks/async.tasks";
import { ASYNC_TASK } from "../../state/ducks/async.tasks/constants";
import { GetAsyncTaskResponse } from "../../state/ducks/async.tasks/types";
import {
  EffectiveDateFormValues, PasswordFormValues,
} from "../change.request/form/types";
import { toastError } from "../components/notifications";
import { TableDataProps, TablePanelStateProps } from "../components/table/types";
import Text from "../components/Text";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import useDialog from "../hooks/useDialog";
import { styles } from "./async.tasks.styles";
import PasswordDialogueContainer from "./dialogs/PasswordDialogue";
import DateForm from "./forms/date.form/date.form";
import EmptyForm from "./forms/empty.form/empty.form";
import PasswordExpirationEmailSpecificForm from "./forms/password.expiration.email.specific/password.expiration.email.specific.form";
import PasswordExpirationForm from "./forms/password.expiration.form/password.expiration.form";
import TimeTravelCompany from "./forms/time.travel.company.form/time.travel.company.form";
import TimeTravelForm from "./forms/time.travel.form/time.travel.form";
import TimeTravelUser from "./forms/time.travel.user.form/time.travel.user.form";
import UUIDBasedForm from "./forms/uuid.form/uuid.form";
import gridConfiguration from "./kendo/column.definition";
import { dropDownOptions } from "./kendo/helper";
import { KendoPanel } from "./kendo/KendoPanel";
import { SQS_TYPES, TimeTravelProps } from "./types";

interface Props {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  data: TableDataProps<GetAsyncTaskResponse>;
}

const AsyncTasksPresenter: React.FunctionComponent<Props> = ({
  tableName,
  data,
  tableCriteria,
}) => {
  const classes = styles();
  const [type, setType] = React.useState("");
  const [payload, setPayload] = React.useState("");
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as string);
  };
  const intl = useIntl();
  const executeAsyncTask = useActionCreator(AsyncTaskActions.executeAsyncTask);
  const executeSessionTimeTravelAsyncTask = useActionCreator(AsyncTaskActions.executeSessionTimeTravelAsyncTask);
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
    if ([SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS].includes(SQS_TYPES[type])) {
      setPayload(JSON.stringify({
        taskType: type,
        currentDate: selectedDate,
      }));
    }
    else if ([SQS_TYPES.SEND_PASSWORD_EXPIRATION_EMAILS].includes(SQS_TYPES[type])) {
      setPayload(JSON.stringify({
        taskType: type,
        processedAtTimestamp: selectedDate,
      }));
    }
    else {
      setPayload(JSON.stringify({
        taskType: type,
        timestamp: selectedDate,
      }));
    }
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
    setPayload(JSON.stringify( [SQS_TYPES.RECALC_COMPLIANCE_FOR_ON_EQ_RELEASE].includes(SQS_TYPES[type]) ? {
      taskType: type,
      docRevId: uuid,
    } : {
      taskType: type,
      pageDetailsId: uuid,
    }));
    openApproveDialog();
  };
  const handleTimeTravelFormSubmit = (values: TimeTravelProps) => {
    if ([SQS_TYPES.TIME_TRAVEL_USER_SESSION].includes(SQS_TYPES[type])) {
      setPayload(JSON.stringify(values));
    }
    openApproveDialog();
  };
  const handleTimeTravelCompany = (values: TimeTravelProps) => {
    if ([SQS_TYPES.TIME_TRAVEL_COMPANY].includes(SQS_TYPES[type])) {
      setPayload(
        JSON.stringify({
          taskType: type,
          timeTravel: values,
        })
      );
    }
    openApproveDialog();
  };
  const handleTimeTravelUser = (values: TimeTravelProps) => {
    if ([SQS_TYPES.TIME_TRAVEL_USER].includes(SQS_TYPES[type])) {
      setPayload(
        JSON.stringify({
          taskType: type,
          timeTravel: values,
        })
      );
    }
    openApproveDialog();
  };
  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    const updatedPayload = JSON.parse(payload);
    if ([SQS_TYPES.TIME_TRAVEL_USER_SESSION].includes(SQS_TYPES[type])) {
      async.start(
        executeSessionTimeTravelAsyncTask,
        { ...updatedPayload, ...values },
        async
      );
    } else {
      async.start(executeAsyncTask, { ...updatedPayload, ...values }, async);
    }
  };
  return (
    <Grid container className={classes.root}>
      <Grid item>
        <FormControl className={classes.formControl}>
          <InputLabel id="sqs-messages-type-select-outlined-label">
            <Text translation="async.tasks.type" />
          </InputLabel>
          <Select
            labelId="sqs-messages-type-select-outlined-label"
            id="sqs-messages-type-select-outlined"
            value={type}
            className={classes.optionSelect}
            onChange={handleChange}
          >
            {dropDownOptions.sort((a, b) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0)).map((data, index) => (
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
          SQS_TYPES.RECALC_COMPLIANCE_FOR_EQUIPMENTS,
        ].includes(SQS_TYPES[type]) && (
          <EmptyForm {...{ handleEmptyFormSubmit }} key={type}/>
        )}
        {type &&
        [
          SQS_TYPES.TRAINING_RECORDS_STATUS,
          SQS_TYPES.TRAINING_RECORDS_REFRESH,
          SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS,
          SQS_TYPES.DELETE_COMPANIES_SCHDEULED_FOR_DELETE,
          SQS_TYPES.PRECALC_DOC_TYPE_FOR_COMPANY,
          SQS_TYPES.FIXER_RETRIEVE_CURRENCIES,
          SQS_TYPES.SEND_COMPANY_CONFIG_DIFF_TO_EMAILS,
          SQS_TYPES.GENERATE_COMPANY_CONFIGS,
          SQS_TYPES.CLOSE_CR_BY_EFFECTIVE_DATE,
          SQS_TYPES.USAGE_REPORT,
          SQS_TYPES.SEND_PASSWORD_EXPIRATION_EMAILS,
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
          SQS_TYPES.PRECALC_PAGE_DETAILS,
        ].includes(SQS_TYPES[type]) && (
          <UUIDBasedForm {...{ handleuuidFormSubmit, type }} key={type}/>
        )}
        {type &&
        [
          SQS_TYPES.TIME_TRAVEL_USER_SESSION,
        ].includes(SQS_TYPES[type]) && (
          <TimeTravelForm {...{ handleTimeTravelFormSubmit }} key={type}/>
        )}
        {type &&
        [
          SQS_TYPES.TIME_TRAVEL_COMPANY,
        ].includes(SQS_TYPES[type]) && (
          <TimeTravelCompany {...{ handleTimeTravelCompany }} key={type}/>
        )}
        {type &&
        [
          SQS_TYPES.TIME_TRAVEL_USER,
        ].includes(SQS_TYPES[type]) && (
          <TimeTravelUser {...{ handleTimeTravelUser }} key={type}/>
        )}
        <PasswordDialogueContainer
          transition="approve"
          asyncState={async.asyncState}
          onSubmit={onSubmit}
          transitionDialog={transitionDialog}
          label=""
        />
      </Grid>
      <Grid item={true}>
        <KendoPanel<GetAsyncTaskResponse>
          gridConfiguration={gridConfiguration}
          queryUrl={ASYNC_TASK}
          gridData={data}
          tableName={tableName}
          tableCriteria={tableCriteria}
        />
      </Grid>
    </Grid>
  );
};
export default AsyncTasksPresenter;
