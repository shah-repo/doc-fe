import { Box } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bulkImportActions, bulkImportSelectors } from '../../../../state/ducks/bulkImport';
import { BulkImport, SystemHeaderEntity } from '../../../../state/ducks/bulkImport/types';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import StepTitle from '../StepTitle';
import SelectedBoxes from './SelectedBoxes';
import useStyles from './styles';
import { createValidationSchema } from './validation';

interface SourceTargetProps {
  children?: ReactNode
  bulkImport?: BulkImport
  handleNext: () => void
}

export interface InitialValues {
  [key: string]: string
}

const SourceTarget: React.FC<SourceTargetProps> = ({ children, handleNext, bulkImport }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const headers = useSelector(bulkImportSelectors.getHeaders);
  const uploadFileDataAction = useActionCreator(bulkImportActions.saveHeaderToMap);

  const asyncHeadersToMap = useAsync({
    onSuccess: () => {
      handleNext();
    },
  });

  const handleSubmit = (values: Record<string, string>) => {
    // Handle form submission and file processing
    if (headers) {
      const updatedSystemHeaders: SystemHeaderEntity[] = headers.system.map((header: SystemHeaderEntity) => ({
        ...header,
        match: values[header.id] || '',
      }));

      dispatch(bulkImportActions.setIsLoading(true));
      asyncHeadersToMap.start(uploadFileDataAction, { headers: { custom: headers.custom, system: updatedSystemHeaders }, bulkImportId: bulkImport?.id }, asyncHeadersToMap);
    }
  };

  useEffect(() => {
    if (bulkImport) {
      dispatch(bulkImportActions.setIsLoading(true));
      dispatch(bulkImportActions.getHeadersToMap(bulkImport.id));
    }
  }, [bulkImport, dispatch]);

  if (!headers || !headers?.system) return null;

  const validationSchema = createValidationSchema(headers.system);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const initialValues: InitialValues = headers.system.reduce((acc: InitialValues, header: SystemHeaderEntity) => {
    if (header.match && header.match.trim() !== '') {
      acc[header.id] = header.match;
    }
    return acc;
  }, {});

  // NOTE: we add a key to force the form to render again when the data change
  return (
    <Box key={headers.system ? headers.system[0]?.id : 'no-data'}>
      <StepTitle title="bulkImport.mapColumns.title" subTitle="bulkImport.mapColumns.subTitle" />
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form className={classes.form}>
          <SelectedBoxes customHeaders={headers.custom} systemHeaders={headers.system} />
          {children}
        </Form>
      </Formik>
    </Box>
  );
};

export default SourceTarget;
