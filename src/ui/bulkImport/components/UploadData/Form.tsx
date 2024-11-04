import { Box } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { ReactNode, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cleanUpMappedHeaders, setIsLoading, setTemplateFile, uploadFileData } from '../../../../state/ducks/bulkImport/actions';
import { getBulkImport, getTemplateFile } from '../../../../state/ducks/bulkImport/selectors';
import { getDownloadTemplate } from '../../../../state/ducks/bulkImport/utils';
import { store } from '../../../../state/store';
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
  const loadFromBk = useRef<boolean>(false);

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
    } else if (bulkImport?.xlsx && bulkImport?.xlsx.length > 0 && formFiles.length === 0) {
      handleNext();
    } else {
      toastError('Please select a file to continue', { position: 'top-right' });
    }
  };

  const handleRemoveFile = (index: number) => {
    dispatch(setTemplateFile(files.filter((_, i) => i !== index)));
  };

  const handleDownloadFile = async () => {
    if (bulkImport) {
      const { employeeId, sessionId } = store.getState().auth.user;
      await getDownloadTemplate(bulkImport.id, { employeeId, sessionId });
    }
  };

  useEffect(() => {
    // If the user already upload the excelFile we are going to show a preview of it.
    if (bulkImport?.excelFile && files.length === 0 && !loadFromBk.current) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const initialFile = {
        name: `${bulkImport.excelFile.name}.${bulkImport.excelFile.type}`,
        preview: bulkImport.excelFile.s3link,
        size: bulkImport.excelFile.fileSizeS3Link,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        lastModified: new Date(bulkImport.excelFile.updatedAt).getTime(),
      } as FileWithPreview;
      dispatch(setTemplateFile([initialFile]));
      loadFromBk.current = true;
    }
  }, [bulkImport, files, dispatch]);

  useEffect(() => {
    if (!bulkImport?.excelFile && files.length > 0) {
      dispatch(setTemplateFile([]));
    }
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
