import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { GroupTag } from '../../../../../state/ducks/auth/types';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import { AsyncStatus } from '../../../../../state/types';
import PromptIfDirty from '../../../../components/forms/PromptIfDirty';
import { toastError } from '../../../../components/notifications';
import { HOME_URL } from '../../../../constants/urls';
import useGetHasTag from '../../../../hooks/useGetHasTag';
import GeneralSettingsPresenter from './presenter';

const GeneralSettingsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const initialValues = useSelector(companySelectors.getGeneralSettings);
  const updatedAt = useSelector(companySelectors.getGeneralSettingsUpdatedAt);
  const asyncState = useSelector(companySelectors.getGeneralSettingsAsyncState);
  const isLoading = asyncState.status === AsyncStatus.Active;
  const [doNotPrompt, setDoNotPrompt] = useState(false);
  const canManageSettings = useGetHasTag(GroupTag.ADMIN_MANAGEMENT);

  const formik = useFormik<GeneralSettings>({
    initialValues,
    validationSchema: Yup.object().shape({
    trainingReminders: Yup.object({
      customDaysDueOn: Yup.object({
        days: Yup.number().required('common.required').min(1),
      }),
    }),
    }),
    onSubmit: (values: GeneralSettings) => {
      dispatch(companyActions.updateGeneralSettings(values));
    },
  });

  const { dirty, setValues } = formik;

  useEffect(() => {
    if (!isLoading) {
      setValues(initialValues);
    }
  }, [setValues, initialValues, isLoading]);

  useEffect(() => {
    if (asyncState.status === AsyncStatus.Error && asyncState.message) {
      toastError(asyncState.message);
    }
  }, [asyncState]);

  const handlePromptConfirm = () => setDoNotPrompt(true);

  if (!canManageSettings) {
    return <Redirect to={HOME_URL} />;
  }

  return (
    <FormikProvider value={formik}>
      <PromptIfDirty
        isDialog
        dirty={dirty}
        doNotPrompt={doNotPrompt}
        onConfirm={handlePromptConfirm}
      />
      <GeneralSettingsPresenter
        onSave={formik.submitForm}
        updatedAt={updatedAt}
        isLoading={isLoading}
      />
    </FormikProvider>
  );
};

export default GeneralSettingsContainer;
