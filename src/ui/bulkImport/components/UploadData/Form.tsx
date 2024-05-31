import { Box } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bulkImportActions, bulkImportSelectors } from '../../../../state/ducks/bulkImport';
import Text from '../../../components/Text';
import { Button } from '../../../components/forms/fields-next';
import DropzoneField, { FileWithPreview } from '../../../components/forms/fields-next/Dropzone/Dropzone.field';
import { toastError } from '../../../components/notifications';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import ListFiles from '../ListFiles';
import StepTitle from '../StepTitle';
import useStyles from './styles';

interface UploadDataProps {
  children?: ReactNode
  handleNext: () => void
}

const UploadData: React.FC<UploadDataProps> = ({ children, handleNext }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const uploadFileDataAction = useActionCreator(bulkImportActions.uploadFileData);
  const files = useSelector(bulkImportSelectors.getTemplateFile);
  const bulkImport = useSelector(bulkImportSelectors.getBulkImport);

  const asyncUploadFile = useAsync({
    onSuccess: () => {
      handleNext();
    },
  });

  const handleFilesDrop = (acceptedFilesWithPreview: FileWithPreview[]) => {
    dispatch(bulkImportActions.setTemplateFile(acceptedFilesWithPreview));
  };

  const handleSubmit = (values: {files: FileWithPreview[]}) => {
    const formFiles: FileWithPreview[] = values.files;
    // Handle form submission and file processing
    if (formFiles.length > 0 && bulkImport?.id) {
      dispatch(bulkImportActions.setIsLoading(true));
      asyncUploadFile.start(uploadFileDataAction, { file: formFiles[0], bulkImportId: bulkImport.id }, asyncUploadFile);
    } else {
      toastError('Please select a file to continue', { position: 'top-right' });
    }
  };

  const handleRemoveFile = (index: number) => {
    dispatch(bulkImportActions.setTemplateFile(files.filter((_, i) => i !== index)));
  };

  const handleDownloadFile = () => {
    if (bulkImport) {
      dispatch(bulkImportActions.getDownloadFile(bulkImport.id));
    }
  };

  useEffect(() => {
    dispatch(bulkImportActions.setTemplateFile([]));
  }, []);

  return (
    <>
      <StepTitle title="bulkImport.uploadTemplate" subTitle="bulkImport.uploadData.subtitle" extraTitle="bulkImport.uploadData.subtitle2" className={classes.titleContainer} />
      <Box className={classes.buttonsContainer}>
        <Button
          kind="secondary"
          onClick={handleDownloadFile}
          className={classes.sampleTemplate}
        >
          <Text translation="bulkImport.downloadSampleTemplate" />
        </Button>
      </Box>
      <Box className={classes.container}>
        <Formik initialValues={{ files: [] }} onSubmit={handleSubmit}>
          <Form>
            <DropzoneField name="files" onDropCallback={handleFilesDrop} multiple={false} accept={{
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
                '.xlsx',
              ],
            }} />
            <ListFiles files={files} handleRemoveFile={handleRemoveFile} />
            {children}
          </Form>
        </Formik>
      </Box>
    </>
  );
};

export default UploadData;
