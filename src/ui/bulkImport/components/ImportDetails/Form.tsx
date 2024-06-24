import {
  Box,
  FormControl,
  Link,
  Typography,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBulkImport, getDataTypes, getFormDocumentsTypeGroup, setIsLoading } from '../../../../state/ducks/bulkImport/actions';
import { getDataTypeSelectList, getFormDocumentsTypeGroupSelectList } from '../../../../state/ducks/bulkImport/selectors';
import Text from '../../../components/Text';
import SelectField from '../../../components/forms/fields/Select';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import StepTitle from '../StepTitle';
import useStyles from './styles';
import { validationSchema } from './validation';

interface FormValues {
  processType: string
  formId: string
}

interface ImportDetailFormProps {
  children?: ReactNode
  handleNext: () => void
}

const ImportDetailForm: React.FC<ImportDetailFormProps> = ({ children, handleNext }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const createBulkImportAction = useActionCreator(createBulkImport);
  const async = useAsync({
    onSuccess: (complete?) => {
      if (complete) {
        handleNext();
      }
    },
  });

  const typeOfDataOptions = useSelector(getDataTypeSelectList);
  const formDocumentsTypeGroupOptions = useSelector(getFormDocumentsTypeGroupSelectList);

  const handleTypeOfDataChange = (value) => {
    dispatch(setIsLoading(true));
    dispatch(getFormDocumentsTypeGroup(value as string));
  };

  useEffect(() => {
    dispatch(setIsLoading(true));
    dispatch(getDataTypes());
  }, [dispatch]);

  return (
    <Box className={classes.container}>
      <Formik
        initialValues={{ processType: '', formId: '' }}
        validationSchema={validationSchema}
        onSubmit={(values: FormValues) => {
          dispatch(setIsLoading(true));
          async.start(createBulkImportAction, values, async);
        }}
      >
        <Form>
          <StepTitle title="bulkImport.approvals.step1Title" subTitle="bulkImport.approvals.step1SubTitle" />
          <Box>
            <FormControl className={`form-control ${classes.formControl}`} id="OwnerChangerPresenter-selectField">
              <SelectField
                selectProps={{ id: 'processType', onChange: (e) => handleTypeOfDataChange(e.target.value) }}
                name="processType"
                includeEmpty={false}
                options={typeOfDataOptions}
                inputStyleProps={classes.select}
              />
            </FormControl>
          </Box>
          <Box className={formDocumentsTypeGroupOptions.length ? '' : classes.hide}>
            <Typography variant="h4" className={classes.selectLabel}>
              2. <Text translation="bulkImport.formDocumentsTypeGroup" />
            </Typography>
            <FormControl className={`form-control ${classes.formControl}`} id="OwnerChangerPresenter-selectField">
              <SelectField
                selectProps={{ id: 'formId' }}
                name="formId"
                includeEmpty={false}
                options={formDocumentsTypeGroupOptions}
                inputStyleProps={classes.select}
              />
              <Link href="#" className={classes.contactSupportLink}>
                <Text translation="bulkImport.contactSupport" />
              </Link>
            </FormControl>
          </Box>
          {children}
        </Form>
      </Formik>
    </Box>
  );
};

export default ImportDetailForm;
