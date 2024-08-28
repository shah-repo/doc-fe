import { Box, CircularProgress } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { translate } from '../../common/intl';
import { deleteBulkImport, setCurrentStep, setIsLoading } from '../../state/ducks/bulkImport/actions';
import { getBulkImport, getIsLoading, getStep } from '../../state/ducks/bulkImport/selectors';
import { Button } from '../components/forms/fields-next';
import Text from '../components/Text';
import { BULK_IMPORT_PROGRESS_URL } from '../constants/urls';
import useActionCreator from '../hooks/useActionCreator';
import useAsync from '../hooks/useAsync';
import Approvals from './components/Approvals/Form';
import ButtonActions from './components/ButtonActions';
import DeleteDialog from './components/Dialogs/DeleteDialog';
import ImportDetailForm from './components/ImportDetails/Form';
import MapColumns from './components/MapColumns/Container';
import Steps from './components/Steps';
import UploadAttachment from './components/UploadAttachment/Form';
import UploadDataForm from './components/UploadData/Form';
import useStyles from './styles';

interface BulkImportContainerProps extends RouteComponentProps {}

const steps = [translate('bulkImport.step.importDetails'), translate('bulkImport.step.uploadData'), translate('bulkImport.mapColumns'), translate('bulkImport.step.uploadAttachments'), translate('bulkImport.approvals')];

const BulkImportContainer: React.FunctionComponent<BulkImportContainerProps> = ({ history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const activeStep = useSelector(getStep);
  const isLoading = useSelector(getIsLoading);
  const bulkImport = useSelector(getBulkImport);
  const deleteBulkImportAction = useActionCreator(deleteBulkImport);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const asyncDeleteBk = useAsync({
    onSuccess: () => {
      history.push(BULK_IMPORT_PROGRESS_URL);
    },
  });

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleNext = () => {
    dispatch(setCurrentStep(activeStep + 1));
  };

  const handleBack = () => {
    dispatch(setCurrentStep(activeStep - 1));
  };

  const handleReset = () => {
    dispatch(setCurrentStep(0));
  };

  const handleCancel = () => {
    if (bulkImport?.id) {
      dispatch(setIsLoading(true));
      asyncDeleteBk.start(deleteBulkImportAction, { bulkImportId: bulkImport.id }, asyncDeleteBk);
    }
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ImportDetailForm handleNext={handleNext}>
            <ButtonActions activeStep={activeStep} steps={steps} handleNext={handleNext} handleBack={handleBack} handleReset={handleReset} nextSubmit />
          </ImportDetailForm>
        );
      case 1:
        return (
          <UploadDataForm handleNext={handleNext}>
            <ButtonActions activeStep={activeStep} steps={steps} handleCancel={handleOpenDelete} handleNext={handleNext} handleBack={handleBack} handleReset={handleReset} nextSubmit useCancel />
          </UploadDataForm>
        );
      case 2:
        return (
          <MapColumns handleNext={handleNext} handleCancel={handleCancel}>
            <ButtonActions activeStep={activeStep} steps={steps} handleCancel={handleOpenDelete} handleNext={handleNext} handleBack={handleBack} handleReset={handleReset} nextSubmit useBack useCancel />
          </MapColumns>
        );
      case 3:
        return (
          <UploadAttachment handleNext={handleNext}>
            <ButtonActions activeStep={activeStep} steps={steps} handleCancel={handleOpenDelete} handleNext={handleNext} handleBack={handleBack} handleReset={handleReset} nextSubmit useBack useCancel />
          </UploadAttachment>
        );
      case 4:
        return (
          <Approvals>
            <ButtonActions activeStep={activeStep} steps={steps} handleCancel={handleOpenDelete} handleNext={handleNext} handleBack={handleBack} handleReset={handleReset} nextTranslation="bulkImport.approvals.submit" nextSubmit useBack useCancel />
          </Approvals>
        );
      default:
        return null;
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Box className={classes.backToDashboard}>
          <Button component={Link} to={BULK_IMPORT_PROGRESS_URL} kind="outlined" >
            <Text translation="bulkImport.backToDashbord" />
          </Button>
        </Box>
        <Steps activeStep={activeStep} steps={steps} />
      </Box>
      {isLoading && <Box className={classes.loadingContainer}>
        <CircularProgress color="primary" size={24} className={classes.loading} />
      </Box>}
      {getStepContent()}
      <DeleteDialog open={openDeleteDialog} handleClose={handleCloseDelete} handleConfirm={handleCancel} />
    </Box>
  );
};

export default withRouter(BulkImportContainer);
