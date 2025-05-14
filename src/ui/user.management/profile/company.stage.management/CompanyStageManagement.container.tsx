import { Box } from '@material-ui/core';
import { FormikProvider, useFormik } from 'formik';
import { isEmpty } from 'lodash';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { GroupTag } from '../../../../state/ducks/auth/types';
import { companyActions, companySelectors } from '../../../../state/ducks/company';
import AlertDialog from '../../../app/alert.dialog/AlertDialog';
import { toastError } from '../../../components/notifications';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import useGetHasTag from '../../../hooks/useGetHasTag';
import { Translation } from '../../../translations/types';
import { getObjectChangedValues, objectValuesToNumber, objectValuesToString } from '../../utils/transform';
import CompanyStageManagementPresenter from './CompanyStageManagement.presenter';

const MAX_NUM_OF_REV_STAGES = 3;

interface FormikValues {
  numOfRevStages: string
  startRevisionNumber: string
}

const CompanyStageManagementContainer: React.FC = () => {
  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);
  const canManageCompanyStage = useGetHasTag(GroupTag.COMPANY_CONFIG_DOCUMENT_REV_STAGES);
  const numOfRevStages = useSelector(companySelectors.getCompanyMaxRevisionStage);
  const startRevisionNumber = useSelector(companySelectors.getCompanyStartRevisionNumber);
  const initialValues = objectValuesToString({ numOfRevStages, startRevisionNumber });
  const valuesToSave = useRef<Partial<FormikValues>>();

  const confirmationDialog = useDialog();

  const updateCompany = (values: Partial<FormikValues>) => {
    confirmationDialog.close();
    async.start(
      changeCompanyAction,
      objectValuesToNumber(values),
      async,
    );
  };

  const saveValues = () => {
    if (valuesToSave.current) {
      updateCompany(valuesToSave.current);
    }
    confirmationDialog.close();
  };

  const resetState = () => {
    valuesToSave.current = undefined;
    confirmationDialog.close();
  };

  const async = useAsync({
    onError: toastError,
    onSuccess: resetState,
  });

  const formik = useFormik<FormikValues>({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const changedValues = getObjectChangedValues(initialValues, values);

      if (isEmpty(changedValues)) {
        return;
      }

      if (changedValues.numOfRevStages) {
        valuesToSave.current = changedValues;
        confirmationDialog.open();
        return;
      }

      updateCompany(changedValues);
    },
  });

  if (!canManageCompanyStage) {
    return null;
  }

  const msg = translate('user.management.profile.companyStage.alert', { revStage: valuesToSave.current?.numOfRevStages }) as Translation;

  return (
    <Box>
      {confirmationDialog.isOpen && (
        <AlertDialog
          dialog={confirmationDialog}
          confirmAction={saveValues}
          cancelAction={resetState}
          message={msg}
        />
      )}
      <FormikProvider value={formik}>
        <CompanyStageManagementPresenter
          asyncState={async.asyncState}
          disabled={numOfRevStages >= MAX_NUM_OF_REV_STAGES}
        />
      </FormikProvider>
    </Box>
  );
};

export default CompanyStageManagementContainer;
