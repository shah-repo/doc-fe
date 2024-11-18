import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Dialog, Divider, Typography } from '@material-ui/core';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { Form, Formik } from 'formik';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { patchBulkImport, setIsLoading, uploadS3 } from '../../../../state/ducks/bulkImport/actions';
import { skippedAttachmentFile } from '../../../../state/ducks/bulkImport/constants';
import { getBulkImport } from '../../../../state/ducks/bulkImport/selectors';
import { BulkImport } from '../../../../state/ducks/bulkImport/types';
import Text from '../../../components/Text';
import { AlertDialog } from '../../../components/dialogs';
import { Button } from '../../../components/forms/fields-next';
import { FileWithPreview } from '../../../components/forms/fields-next/Dropzone/Dropzone.types';
import { DropzoneField } from '../../../components/forms/fields-next/index';
import InputField from '../../../components/forms/fields/Input';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import ListFiles from '../ListFiles';
import MessageInformation from '../MessageInformation';
import StepTitle from '../StepTitle';
import Tree from './Tree';
import useStyles from './styles';
import { validationSchema } from './validation';

const errorsList = ['ECO-00100', 'ECO-00121', 'ECO-00124', 'ECO-00198', 'ECO-00201'];

interface UploadAttachmentProps {
  children?: ReactNode
  handleNext: () => void
}

const UploadAttachment: React.FC<UploadAttachmentProps> = ({ children, handleNext }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const bulkImport = useSelector(getBulkImport);
  const uploadFileDataAction = useActionCreator(uploadS3);
  const patchBkSkipAttachment = useActionCreator(patchBulkImport);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const dialog = useDialog();
  const showErrors = false;
  const loadFromBk = useRef<boolean>(false);
  const openMaxSizeExceededDialog = useDialog();

  const asyncUploadFile = useAsync({
    onSuccess: () => handleNext(),
  });

  const asyncSkipAttachment = useAsync({
    onSuccess: () => handleNext(),
  });

  const handleFilesDrop = (acceptedFilesWithPreview: FileWithPreview[]) => {
    setFiles([...acceptedFilesWithPreview]);
  };

  const handleSubmit = (values: { files: FileWithPreview[], link: string }) => {
    // if the user wants to skip the step
    // eslint-disable-next-line no-mixed-operators
    if ((values.files.length === 0 && !values.link) || (values.link === bulkImport?.s3Link || bulkImport?.attachmentId && files.length === 0)) {
      dispatch(setIsLoading(true));
      asyncSkipAttachment.start(patchBkSkipAttachment, { bulkImportId: bulkImport?.id, data: { attachmentLink: skippedAttachmentFile } }, asyncSkipAttachment);
      return;
    }
    // Handle form submission and file processing
    dispatch(setIsLoading(true));
    asyncUploadFile.start(uploadFileDataAction, { file: values.files && values.files.length > 0 ? values.files[0] : null, link: values.link ? values.link : null, bulkImportId: (bulkImport as BulkImport)?.id }, asyncUploadFile);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleConfirmOpen = () => {
    dialog.open();
  };

  const handleConfirmClose = () => {
    dialog.close();
  };

  useEffect(() => {
    if (bulkImport?.zipFile && files.length === 0 && !loadFromBk.current) {
      const initialFile = {
        name: `${bulkImport.zipFile.name}.${bulkImport.zipFile.type}`,
        preview: bulkImport.zipFile.s3link,
        size: bulkImport.zipFile.fileSizeS3Link,
        type: 'application/zip',
        lastModified: new Date(bulkImport.zipFile.updatedAt).getTime(),
      } as FileWithPreview;
      setFiles([initialFile]);
      loadFromBk.current = true;
    }
  }, [bulkImport, files]);

  // Reset files state if no zip file is available
  useEffect(() => {
    if (!bulkImport?.zipFile && files.length > 0) {
      setFiles([]);
    }
  }, [bulkImport]);

  const renderMessage = (showError = false) => {
    if (!showErrors) return null;

    return (
      <MessageInformation showLink={false} showError={true} message={translate('bulkImport.mismatchedStructure')} />
    );
  };

  const onMaxSizeExceeded = () => {
    openMaxSizeExceededDialog.open();
  };

  const handleCloseMaxSize = () => {
    openMaxSizeExceededDialog.close();
  };

  const renderForm = () => {
    if (showErrors) {
      return (
        <Box className={classes.errorsContainer}>
          <Typography className={classes.errorsTitle}><Text translation="common.folder.errorFound" /></Typography>
          <Box className={classes.errorsList}>
            {errorsList.map(err => (
              <Box className={classes.errorCard}>
                {err}
                <ReportProblemOutlinedIcon className={classes.warningIcon} />
              </Box>
            ))}
          </Box>
          <Box className={classes.reUploadContainer}>
            <Button
              onClick={handleNext}
              className={classes.reUpload}
            >
              <Text translation="common.file.reUpload" />
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <Formik initialValues={{
        files: [],
        link: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
        <Form>
          <InputField
            name="link"
            size="sm"
            label="bulkImport.uploadFromLink"
            inputProps={{ id: 'link', placeholder: 's3://bulk-import-test/eco' }}
            inputStyleProps={classes.linkInput}
            labelProps={{ color: 'black', fontSize: 14, fontWeight: 600 }}
          />
          <Box my={2} display="flex" alignItems="center">
            <Divider style={{ flex: 1 }} />
            <Typography variant="h6" className={classes.or}>
              <Text translation="common.or" />
            </Typography>
            <Divider style={{ flex: 1 }} />
          </Box>
          <Typography className={classes.dropzoneLabel}><Text translation="common.file.OrUploadFromFiles" /></Typography>
          <DropzoneField name="files" onDropCallback={handleFilesDrop} className={classes.dropzopne} accept={{ 'application/zip': ['.zip'] }} onMaxSizeExceeded={onMaxSizeExceeded}>
            <Typography variant="body2" className={classes.textDropZone}>
              <span><Text translation="dropzone.noDrag.textOr" /><span className={classes.browseText}><Text translation="dropzone.noDrag.subText" /></span></span>
            </Typography>
          </DropzoneField>
          <ListFiles files={files} handleRemoveFile={handleRemoveFile} />
          {children}
        </Form>
      </Formik>
    );
  };

  return (
    <>
      <StepTitle title="bulkImport.uploadAttachments.title" subTitle={showErrors ? 'bulkImport.uploadAttachments.subTitleError' : 'bulkImport.uploadAttachments.subTitle'} extraTitle={!showErrors ? 'bulkImport.uploadAttachments.subTitle2' : undefined} className={classes.titleContainer2} />
      <Box className={classes.buttonsContainer}>
        <Button
          kind="secondary"
          onClick={handleConfirmOpen}
          className={classes.sampleTemplate}
        >
          <FontAwesomeIcon
            className={classes.folderTreeIcon}
            icon={regular('folder-tree')}
          />
          <Text translation="bulkImport.approvals.viewFolderStructureGuide" />
        </Button>
        {renderMessage()}
      </Box>
      <Box className={classes.container}>
        <Box className={showErrors ? classes.formContainerError : classes.formContainer}>
          {renderForm()}
        </Box>
        <Dialog
          open={dialog.isOpen}
          onClose={handleConfirmClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box className={classes.guideRoot}>
            <Box className={classes.guideTitleContainer}>
              <Typography className={classes.guideTitle}><Text translation="common.folder.structureGuide" /></Typography>
            </Box>
            <Box className={classes.guideList}>
              <Tree />
            </Box>
          </Box>
        </Dialog>
      </Box>
      <AlertDialog
        handler={openMaxSizeExceededDialog}
        cancelLabel="common.no.go.back"
        onConfirm={handleCloseMaxSize}
        confirmLabel="common.ok"
        isCancelButtonHidden
      >
        <p>{translate('bulkImport.maxSizeDialogDescription')}</p>
      </AlertDialog>
    </>
  );
};

export default UploadAttachment;
