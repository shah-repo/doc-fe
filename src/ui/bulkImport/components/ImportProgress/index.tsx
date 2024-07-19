import {
  Box,
  Typography,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import { noop } from 'lodash';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { setDataTypeFilter, setStatusFilter } from '../../../../state/ducks/bulkImport/actions';
import { getBulkImports } from '../../../../state/ducks/bulkImport/selectors';
import SelectField from '../../../components/forms/fields/Select';
import Text from '../../../components/Text';
import ProgressSection from '../ProgressSection';
import useStyles from './styles';

const ImportProgress: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const bulkImports = useSelector(getBulkImports);

  const dateTypeOptions = useMemo(() => {
    const uniqueProcessIds = Array.from(new Set(bulkImports.map((item: any) => item.processType)));
    return [{ value: '', text: translate('common.dataType') }, ...uniqueProcessIds.map(id => ({ value: id, text: id }))];
  }, [bulkImports]);
  const statusesOptions = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(bulkImports.map((item: any) => item.status)));
    return [{ value: '', text: 'Status' }, ...uniqueStatuses.map(status => ({ value: status, text: status }))];
  }, [bulkImports]);

  const dataTypeChange = (event) => {
    dispatch(setDataTypeFilter(event.target.value));
  };

  const statusesChange = (event) => {
    dispatch(setStatusFilter(event.target.value));
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.titleContainer}>
        <Typography className={classes.title} variant="h4"><Text translation="bulkImport.progress.importProgress" /></Typography>
        <Box className={classes.filtersContainer}>
          <Formik
            initialValues={{ processType: 'dateType', formId: '' }}
            onSubmit={noop}
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
