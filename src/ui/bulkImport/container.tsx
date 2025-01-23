import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { translate } from '../../common/intl';
import {
  deleteBulkImportSuccess,
  getOneBulkImport,
  patchBulkImport,
  setCurrentStep,
  setIsLoading,
} from '../../state/ducks/bulkImport/actions';
import {
  getBulkImport,
  getIsLoading,
  getStep,
} from '../../state/ducks/bulkImport/selectors';
import { BkStatus, BulkImport } from '../../state/ducks/bulkImport/types';
import { getBulkImportCustomData } from '../../state/ducks/bulkImport/utils';
import { Button } from '../components/forms/fields-next';
import Text from '../components/Text';
import { BULK_IMPORT_PROGRESS_URL } from '../constants/urls';
import useActionCreator from '../hooks/useActionCreator';
import useAsync from '../hooks/useAsync';
import useDialog from '../hooks/useDialog';
import ApprovalsForm from './components/Approvals/Form';
import ButtonActions from './components/ButtonActions';
import DeleteDialog from './components/Dialogs/DeleteDialog';
import ImportDetailForm from './components/ImportDetails/Form';
import ImportingProgress from './components/ImportingProgress';
import MapColumns from './components/MapColumns/Container';
import Steps from './components/Steps';
import UploadAttachment from './components/UploadAttachment/Form';
import UploadDataForm from './components/UploadData/Form';
import useStyles from './styles';

interface BulkImportContainerProps {
  bulkImportId?: string
}

const steps = [
  translate('bulkImport.step.importDetails'),
  translate('bulkImport.step.uploadData'),
  translate('bulkImport.mapColumns'),
  translate('bulkImport.step.uploadAttachments'),
  translate('bulkImport.approvals'),
  translate('bulkImport.importing'),
];

const BulkImportContainer: React.FunctionComponent<
RouteComponentProps<BulkImportContainerProps>
> = ({ history, match }) => {
  const dispatch = useDispatch();
  const { bulkImportId } = match.params;
  const classes = useStyles();
  const activeStep = useSelector(getStep);
  const isLoading = useSelector(getIsLoading);
  const bulkImport = useSelector(getBulkImport);
  console.log('🚀 ~ bulkImport:', bulkImport);
  const deleteBulkImportAction = useActionCreator(patchBulkImport);
  const openDeleteDialog = useDialog();

  const asyncDeleteBk = useAsync({
    onSuccess: () => {
      history.push(BULK_IMPORT_PROGRESS_URL);
    },
  });

  const handleCloseDelete = () => {
    openDeleteDialog.close();
  };

  const handleOpenDelete = () => {
    openDeleteDialog.open();
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

  const afterDeleteBk = (bulkImportId: string) => {
    dispatch(deleteBulkImportSuccess(bulkImportId));
  };

  const handleCancel = () => {
    if (bulkImport?.id) {
      dispatch(setIsLoading(true));
      asyncDeleteBk.start(
        deleteBulkImportAction,
        { bulkImportId: bulkImport.id, data: { status: BkStatus.DELETED }, callback: afterDeleteBk },
        asyncDeleteBk,
      );
    }
  };

  const goToStepBulkImport = (data: BulkImport) => {
    if (data?.id) {
      const customBulkImport = getBulkImportCustomData(data);
      dispatch(setCurrentStep(customBulkImport.currentProgressStep));
    }
  };

  useEffect(() => {
    if ((!bulkImport && bulkImportId) || (bulkImport && bulkImportId && bulkImport.id !== bulkImportId)) {
      dispatch(getOneBulkImport(bulkImportId, goToStepBulkImport));
    }
  }, [bulkImportId, bulkImport, dispatch, goToStepBulkImport]);

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ImportDetailForm handleNext={handleNext}>
            <ButtonActions
              activeStep={activeStep}
              steps={steps}
              handleNext={handleNext}
              handleBack={handleBack}
              handleReset={handleReset}
              nextSubmit
            />
          </ImportDetailForm>
        );
      case 1:
        return (
          <UploadDataForm handleNext={handleNext}>
            <ButtonActions
              activeStep={activeStep}
              steps={steps}
              handleCancel={handleOpenDelete}
              handleNext={handleNext}
              handleBack={handleBack}
              handleReset={handleReset}
              nextSubmit
              useCancel
            />
          </UploadDataForm>
        );
      case 2:
        return (
          <MapColumns handleNext={handleNext} handleCancel={handleOpenDelete}>
            <ButtonActions
              activeStep={activeStep}
              steps={steps}
              handleCancel={handleOpenDelete}
              handleNext={handleNext}
              handleBack={handleBack}
              handleReset={handleReset}
              nextSubmit
              useBack
              useCancel
            />
          </MapColumns>
        );
      case 3:
        return (
          <UploadAttachment handleNext={handleNext}>
            <ButtonActions
              activeStep={activeStep}
              steps={steps}
              handleCancel={handleOpenDelete}
              handleNext={handleNext}
              handleBack={handleBack}
              handleReset={handleReset}
              nextSubmit
              useBack
              useCancel
            />
          </UploadAttachment>
        );
      case 4:
        return (
          <ApprovalsForm>
            <ButtonActions
              activeStep={activeStep}
              steps={steps}
              handleCancel={handleOpenDelete}
              handleNext={handleNext}
              handleBack={handleBack}
              handleReset={handleReset}
              nextTranslation="bulkImport.approvals.submit"
              nextSubmit
              useBack
              useCancel
            />
          </ApprovalsForm>
        );
      case 5:
        return <ImportingProgress />;
      default:
        return null;
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Box className={classes.backToDashboard}>
          <Button
            component={Link}
            to={BULK_IMPORT_PROGRESS_URL}
            kind="ghost"
            classes={{
              label: classes.buttonLabel,
            }}
          >
            <span className={classes.backToDashBoardButtonText}>
              <FontAwesomeIcon
                className={classes.arrowLeftIcon}
                icon={light('arrow-left')}
              />
              <Text translation="bulkImport.backToDashbord" />
            </span>
            {bulkImport?.jobId && <span className={classes.jobIdText}>/ {bulkImport.jobId}</span>}
          </Button>
        </Box>
        <Steps activeStep={activeStep} steps={steps} />
      </Box>
      {isLoading && (
        <Box className={classes.loadingContainer}>
          <CircularProgress
            color="primary"
            size={24}
            className={classes.loading}
          />
        </Box>
      )}
      {getStepContent()}
      <DeleteDialog
        handleClose={handleCloseDelete}
        handleConfirm={handleCancel}
        handler={openDeleteDialog}
      />
    </Box>
  );
};

export default withRouter(BulkImportContainer);
