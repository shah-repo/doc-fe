import { Box } from '@material-ui/core';
import { Formik, FormikProps } from 'formik';
import React, { useState } from 'react';
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
import { toNumRevisionStageBodyValues, toNumRevisionStageInitialValues } from '../../utils/transform';
import CompanyStageManagementPresenter from './CompanyStageManagement.presenter';

const MAX_NUM_OF_REV_STAGES = 3;

const CompanyStageManagementContainer: React.FC<{}> = () => {
  const async = useAsync({
    onError: (error) => toastError(error as string),
  });

  const dialog = useDialog();

  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);
  const canManageCompanyStage = useGetHasTag(GroupTag.COMPANY_CONFIG_DOCUMENT_REV_STAGES);
  const numOfRevStages = useSelector(companySelectors.getCompanyMaxRevisionStage);
  const initialValues = toNumRevisionStageInitialValues(numOfRevStages);
  const [updatingStage, setUpdatingStage] = useState(0);
  if (!canManageCompanyStage) {
    return null;
  }
  const onSubmit = (values: any) => {
    dialog.open();
    setUpdatingStage(values.numOfRevStages);
  };

  const render = (props: FormikProps<any>) => (
    <CompanyStageManagementPresenter
      asyncState={async.asyncState}
      {...props}
      disabled={numOfRevStages === MAX_NUM_OF_REV_STAGES}
    />
  );

  const handleYes = () => {
    dialog.close();
    async.start(changeCompanyAction, toNumRevisionStageBodyValues({ numOfRevStages: updatingStage }), async);
  };

  return (
    <Box>
      {dialog.isOpen && (
        <AlertDialog
          dialog={dialog}
          confirmAction={handleYes}
          cancelAction={dialog.close}
          message={translate('user.management.profile.companyStage.alert', { revStage: updatingStage })}
        />
      )}
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {render}
      </Formik>
    </Box>
  );
};

export default CompanyStageManagementContainer;
