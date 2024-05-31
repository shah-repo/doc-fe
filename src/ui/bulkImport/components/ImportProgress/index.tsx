import {
  Box,
  Typography,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bulkImportActions, bulkImportSelectors } from '../../../../state/ducks/bulkImport';
import SelectField from '../../../components/forms/fields/Select';
import Text from '../../../components/Text';
import ProgressSection from '../ProgressSection';
import useStyles from './styles';

const ImportProgress: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const bulkImports = useSelector(bulkImportSelectors.getBulkImports);

  const dateTypeOptions = useMemo(() => {
    const uniqueProcessIds = Array.from(new Set(bulkImports.map((item: any) => item.processId)));
    return [{ value: '', text: 'Data Type' }, ...uniqueProcessIds.map(id => ({ value: id, text: id }))];
  }, [bulkImports]);
  const statusesOptions = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(bulkImports.map((item: any) => item.status)));
    return [{ value: '', text: 'Status' }, ...uniqueStatuses.map(status => ({ value: status, text: status }))];
  }, [bulkImports]);

  const dataTypeChange = (event) => {
    dispatch(bulkImportActions.setDataTypeFilter(event.target.value));
  };

  const statusesChange = (event) => {
    dispatch(bulkImportActions.setStatusFilter(event.target.value));
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.titleContainer}>
        <Typography className={classes.title} variant="h4"><Text translation="bulkImport.progress.importProgress" /></Typography>
        <Box className={classes.filtersContainer}>
          <Formik
            initialValues={{ processId: 'dateType', formId: '' }}
            onSubmit={(values: any) => {
              console.log('🚀 ~ onSubmit - values:', values);
            }}
          >
            <Form className={classes.form}>
              <Typography className={classes.filterByText}><Text translation="bulkImport.progress.filterBy" /></Typography>
              <SelectField
                selectProps={{ id: 'dateType', onChange: dataTypeChange }}
                name="dateType"
                includeEmpty={false}
                options={dateTypeOptions}
                inputStyleProps={classes.select}
                inputFieldProps={{ inputProps: { className: classes.selectInput } }}
              />
              <SelectField
                selectProps={{ id: 'status', onChange: statusesChange }}
                name="status"
                includeEmpty={false}
                options={statusesOptions}
                inputStyleProps={classes.select}
                inputFieldProps={{ inputProps: { className: classes.selectInput } }}
              />
            </Form>
          </Formik>
        </Box>
      </Box>
      <ProgressSection />
    </Box>
  );
};

export default ImportProgress;
