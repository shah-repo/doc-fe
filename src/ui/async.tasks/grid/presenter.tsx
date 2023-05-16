import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { orderBy } from 'lodash';
import React from 'react';
import { GetAsyncTaskResponse } from '../../../state/ducks/async.tasks/types';
import GridTitle from '../../components/KendoGrid/GridTitle/presenter';
import { KendoGrid } from '../../components/KendoGrid/KendoGrid';
import Text from '../../components/Text';
import PasswordDialogueContainer from '../dialogs/PasswordDialogue';
import DateForm from '../forms/date.form/date.form';
import EmailForm from '../forms/email.form/email.form';
import EmptyForm from '../forms/empty.form/empty.form';
import PasswordExpirationEmailSpecificForm from '../forms/password.expiration.email.specific/password.expiration.email.specific.form';
import PasswordExpirationForm from '../forms/password.expiration.form/password.expiration.form';
import TimeTravelCompany from '../forms/time.travel.company.form/time.travel.company.form';
import TimeTravelForm from '../forms/time.travel.form/time.travel.form';
import TimeTravelUser from '../forms/time.travel.user.form/time.travel.user.form';
import UUIDBasedForm from '../forms/uuid.form/uuid.form';
import { SQS_TYPES } from '../types';
import { dropDownOptions } from './helper';
import { KendoPresenterProps } from './interfaces';
import { styles } from './presenter.styles';

export function AsyncTasksPresenter({
  tableName,
  tableCriteria,
  schema,
  columns,
  onRowClick,
  queryUrl,
  type,
  async,
  transitionDialog,
  handleChange,
  handleEmptyFormSubmit,
  handleDateFormSubmit,
  handlePasswordExpirationFormSubmit,
  handlePasswordExpirationEmailSpecificFormSubmit,
  handleuuidFormSubmit,
  handleEmailFormSubmit,
  handleTimeTravelFormSubmit,
  handleTimeTravelCompany,
  handleTimeTravelUser,
  onSubmit,
}: KendoPresenterProps) {
  const classes = styles();

  return (
    <Box p={2}>
      <Grid container>
        <Grid item xs={12}>
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
              {orderBy(dropDownOptions, ['text'], ['asc']).map((data, index) => (
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
          SQS_TYPES.UNLOCK_USER_AND_SET_DEFAULT_PASSWORD,
        ].includes(SQS_TYPES[type]) && (
            <EmailForm {...{ handleEmailFormSubmit, type }} key={type}/>
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
        <Grid item xs>
          <GridTitle translation="async.task.table.history" />
        </Grid>
        <Grid item xs={12}>
          <KendoGrid<GetAsyncTaskResponse>
            tableName={tableName}
            tableCriteria={tableCriteria}
            schema={schema}
            exportDataChanges={() => ''}
            onRowClick={onRowClick}
            queryUrl={queryUrl}
            defaultPayloadData={{}}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
