import { Box, CircularProgress } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { bulkImportActions, bulkImportSelectors } from '../../state/ducks/bulkImport';
import Approvals from './components/Approvals/Form';
import ButtonActions from './components/ButtonActions';
import ImportDetailForm from './components/ImportDetails/Form';
import MapColumns from './components/MapColumns/Container';
import Steps from './components/Steps';
import UploadAttachment from './components/UploadAttachment/Form';
import UploadDataForm from './components/UploadData/Form';
import useStyles from './styles';

interface BulkImportContainerProps extends RouteComponentProps {}

const steps = ['Import Details', 'Upload Data', 'Map Columns', 'Upload Attachments', 'Approvals'];

const BulkImportContainer: React.FunctionComponent<BulkImportContainerProps> = ({ history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const activeStep = useSelector(bulkImportSelectors.getStep);
  const isLoading = useSelector(bulkImportSelectors.getIsLoading);

  const handleNext = () => {
    dispatch(bulkImportActions.setCurrentStep(activeStep + 1));
  };

  const handleBack = () => {
    dispatch(bulkImportActions.setCurrentStep(activeStep - 1));
  };

  const handleReset = () => {
    dispatch(bulkImportActions.setCurrentStep(0));
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ImportDetailForm handleNext={handleNext}>
            <ButtonActions activeStep={activeStep} steps={steps} handleNext={handleNext} handleBack={handleBack} handleReset={handleReset} nextSubmit useHelp />
          </ImportDetailForm>
        );
      case 1:
        return (
          <UploadDataForm handleNext={handleNext}>
            <ButtonActions activeStep={activeStep} steps={steps} handleNext={handleNext} handleBack={handleBack} handleReset={handleReset} nextSubmit useHelp />
          </UploadDataForm>
        );
      case 2:
        return (
          <MapColumns handleNext={handleNext} handleBack={handleBack}>
            <ButtonActions activeStep={activeStep} steps={steps} handleNext={handleNext} handleBack={handleBack} handleReset={handleReset} nextSubmit useBack />
          </MapColumns>
        );
      case 3:
        return (
          <UploadAttachment handleNext={handleNext}>
            <ButtonActions activeStep={activeStep} steps={steps} handleNext={handleNext} handleBack={handleBack} handleReset={handleReset} nextSubmit useBack useHelp />
          </UploadAttachment>
        );
      case 4:
        return (
          <Approvals handleNext={handleNext}>
            <ButtonActions activeStep={activeStep} steps={steps} handleNext={handleNext} handleBack={handleBack} handleReset={handleReset} nextSubmit useBack useHelp />
          </Approvals>
        );
      default:
        return null;
    }
  };

  return (
    <Box className={classes.root}>
      <Steps activeStep={activeStep} steps={steps} />
      {isLoading && <Box className={classes.loadingContainer}>
        <CircularProgress color="primary" size={24} className={classes.loading} />
      </Box>}
      {getStepContent()}
    </Box>
  );
};

export default withRouter(BulkImportContainer);
