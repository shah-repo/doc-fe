import { Box } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cleanUpMappedHeaders, setIsLoading, setTemplateFile, uploadFileData } from '../../../../state/ducks/bulkImport/actions';
import { getBulkImport, getTemplateFile } from '../../../../state/ducks/bulkImport/selectors';
import { getDownloadTemplate } from '../../../../state/ducks/bulkImport/utils';
import { Button } from '../../../components/forms/fields-next';
import { FileWithPreview } from '../../../components/forms/fields-next/Dropzone/Dropzone.types';
import { DropzoneField } from '../../../components/forms/fields-next/index';
import { toastError } from '../../../components/notifications';
import Text from '../../../components/Text';
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
  const uploadFileDataAction = useActionCreator(uploadFileData);
  const files = useSelector(getTemplateFile);
  const bulkImport = useSelector(getBulkImport);

  const asyncUploadFile = useAsync({
    onSuccess: () => {
      dispatch(cleanUpMappedHeaders());
      handleNext();
    },
  });

  const handleFilesDrop = (acceptedFilesWithPreview: FileWithPreview[]) => {
    dispatch(setTemplateFile(acceptedFilesWithPreview));
  };

  const handleSubmit = (values: {files: FileWithPreview[]}) => {
    const formFiles: FileWithPreview[] = values.files;
    // Handle form submission and file processing
    if (formFiles.length > 0 && bulkImport?.id) {
      dispatch(setIsLoading(true));
      asyncUploadFile.start(uploadFileDataAction, { file: formFiles[0], bulkImportId: bulkImport.id }, asyncUploadFile);
    } else {
      toastError('Please select a file to continue', { position: 'top-right' });
    }
  };

  const handleRemoveFile = (index: number) => {
    dispatch(setTemplateFile(files.filter((_, i) => i !== index)));
  };

  const handleDownloadFile = () => {
    if (bulkImport) {
      getDownloadTemplate(bulkImport.id);
    }
  };

  useEffect(() => {
    dispatch(setTemplateFile([]));
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
            <DropzoneField name="files" onDropCallback={handleFilesDrop} isMultiple={false} accept={{
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
