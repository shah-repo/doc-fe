import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { GroupTag } from '../../../../../state/ducks/auth/types';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { PremiumFeatures } from '../../../../../state/ducks/company/types';
import { AsyncStatus } from '../../../../../state/types';
import PromptIfDirty from '../../../../components/forms/PromptIfDirty';
import { toastError } from '../../../../components/notifications';
import { HOME_URL } from '../../../../constants/urls';
import useGetHasTag from '../../../../hooks/useGetHasTag';
import PremiumFeaturesPresenter from './presenter';

const PremiumFeaturesContainer: React.FC = () => {
  const dispatch = useDispatch();
  const initialValues = useSelector(companySelectors.getPremiumFeatures);
  const updatedAt = useSelector(companySelectors.getPremiumFeaturesUpdatedAt);
  const asyncState = useSelector(companySelectors.getPremiumFeatureAsyncState);
  const isLoading = asyncState.status === AsyncStatus.Active;
  const [doNotPrompt, setDoNotPrompt] = useState(false);
  const canManageSettings = useGetHasTag(GroupTag.ADMIN_MANAGEMENT);

  const formik = useFormik<PremiumFeatures>({
    initialValues,
    onSubmit: (values: PremiumFeatures) => {
      dispatch(companyActions.updatePremiumFeatures(values));
    },
  });

  const { dirty, setValues } = formik;

  useEffect(() => {
    dispatch(companyActions.getPremiumFeatures());
  }, [dispatch]);

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
      <PremiumFeaturesPresenter
        onSave={formik.submitForm}
        setValue={formik.setFieldValue}
        values={formik.values}
        updatedAt={updatedAt}
        isLoading={isLoading}
      />
    </FormikProvider>
  );
};

export default PremiumFeaturesContainer;
