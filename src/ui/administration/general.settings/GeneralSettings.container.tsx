import { FormikProvider, useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { companyActions, companySelectors } from '../../../state/ducks/company';
import { GeneralSettings } from '../../../state/ducks/company/types';
import { AsyncStatus } from '../../../state/types';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import GeneralSettingsPresenter from './GeneralSettings.presenter';

const GeneralSettingsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const initialValues = useSelector(companySelectors.getGeneralSettings);
  const updatedAt = useSelector(companySelectors.getGeneralSettingsUpdatedAt);
  const asyncState = useSelector(companySelectors.getGeneralSettingsAsyncState);

  const formik = useFormik<GeneralSettings>({
    initialValues,
    onSubmit: (values) => {
      dispatch(companyActions.updateGeneralSettings(values));
    },
  });

  const { dirty, setValues } = formik;

  useEffect(() => {
    if (asyncState.status !== AsyncStatus.Active) {
      setValues(initialValues);
    }
  }, [setValues, initialValues, asyncState]);

  return (
    <FormikProvider value={formik}>
      <PromptIfDirty dirty={dirty} />
      <GeneralSettingsPresenter
        onSave={formik.submitForm}
        updatedAt={updatedAt}
        asyncState={asyncState}
      />
    </FormikProvider>
  );
};

export default GeneralSettingsContainer;
