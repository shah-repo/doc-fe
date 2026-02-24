import { Formik, FormikProps } from 'formik';
import { cloneDeep, isEmpty, isEqual } from 'lodash';
import { useObserver } from 'mobx-react';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SMFormHOCProps } from '../../../App';
import { withSMForm } from '../../../App/Shifamed/Components/SMForm/SMForm.hoc';
import { MomentFormats, useDate } from '../../../common/utils/date';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import { companySelectors } from '../../../state/ducks/company';
import { FBDocumentRevisionProps } from '../../../state/ducks/documentRevisions/types';
import { AsyncState } from '../../../state/types';
import styles from '../../common/style/styles';
import { FB, FBBookmarkState, FBProvider, FBWorkspaceModeOptions } from '../../form.builder';
import FBDataStore from '../../form.builder/FBStore/FBDataStore';
import ChangeRequestForm from './ChangeRequestForm';
import { ChangeRequestFormValues } from './types';

interface OwnProps {
  initialValues: ChangeRequestFormValues
  onSubmit: (values: ChangeRequestFormValues) => void
  asyncState: AsyncState
  changeRequest?: ChangeRequest
  doNotPrompt?: boolean
  setDoNotPrompt?: (state: boolean) => void
  setMDTab?: (state: boolean) => void
  chosenForm?: FBDocumentRevisionProps
  hideSideBar?: boolean
  currentDocRevId?: string
  inDialog?: boolean
}

export let changeRequestFormOnScreenContext = React.createContext<boolean>(false);

type ChangeRequestFormContainerProps = OwnProps & SMFormHOCProps;

const ChangeRequestFormContainer: React.FC<ChangeRequestFormContainerProps> = ({
  onSubmit,
  setDoNotPrompt,
  asyncState,
  initialValues,
  changeRequest,
  doNotPrompt,
  chosenForm,
  _formState,
  hideSideBar = false,
  currentDocRevId,
  inDialog = false,
  setMDTab,
}) => {
  const bookmarkState = FB.useRef<FBBookmarkState>(FBBookmarkState);
  const autosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);
  const { formState } = FB.useStores();

  const storeFormInput = useObserver(() => {
    const input = FBDataStore?.refreshData?.changeRequest?.formInput;
    return input || undefined;
  });

  const calcInitialValues = useMemo(() => {
    if (!storeFormInput) return initialValues;

    if (isEqual(storeFormInput, initialValues.formInput)) {
      return initialValues;
    }

    return {
      ...initialValues,
      formInput: storeFormInput,
    };
  }, [initialValues, storeFormInput]);

  const formInput = useMemo(() => {
    return calcInitialValues.formInput
      ? cloneDeep(calcInitialValues.formInput)
      : calcInitialValues.formInput;
  }, [calcInitialValues.formInput]);

  useEffect(() => () => {
    changeRequestFormOnScreenContext = React.createContext<boolean>(false);
    FBDataStore.setRefreshData(undefined);
  }, []);

  const changeOpenStatus = (isDrawerOpen) => {
    setOpen(isDrawerOpen);
  };

  const [isDrawerOpen, setOpen] = React.useState(true);
  const classes = styles({ isDrawerOpen });

  const schemaData = changeRequest
    ? changeRequest.formDocument?.formTemplate?.schema
    : chosenForm?.formTemplate?.schema;

  useEffect(() => {
  _formState?.setMode(FBWorkspaceModeOptions.FORM);
  }, [_formState]);

  const hasInitializedDefaults = React.useRef(false);
  const { convertDateTimeToUserTz } = useDate();

  useEffect(() => {
    // This code was added to update form input fields for the date picker when the ‘set default current date’ flag is enabled.
    // It also helps avoid multiple API calls after creating the AR.
    if (hasInitializedDefaults.current || isEmpty(changeRequest?.formDocument?.id)) return;

    const schemaItems = changeRequest?.formDocument?.formTemplate?.schema ?? [];
    if (!schemaItems.length) return;

    const datePickerItems = schemaItems.filter(
      ({ type, editorProperties }) => type === 'datepicker' && editorProperties?.includes('defaultCurrentDate'),
    );

    if (!datePickerItems.length) return;

    const updates: Record<string, string> = {};

    datePickerItems.forEach(({ name = '' }) => {
      const currentValue = initialValues.formInput?.[name];

      if (!currentValue) {
        updates[name] = convertDateTimeToUserTz(
          moment().format(MomentFormats.MonthDateYearTwoDigit),
          MomentFormats.MonthDateYearTwoDigit,
        );
      }
    });
    if (!isEmpty(updates)) {
      formState?.setValues({
        ...formState?.getValues(),
        ...updates,
      });
    }

    hasInitializedDefaults.current = true;
  }, []);

  const render = useCallback(
    (props: FormikProps<ChangeRequestFormValues>) => (
      <ChangeRequestForm
        formValues={props}
        asyncState={asyncState}
        changeRequest={changeRequest}
        doNotPrompt={doNotPrompt}
        setDoNotPrompt={setDoNotPrompt}
        setMDTab={setMDTab}
        changeOpenStatus={changeOpenStatus}
        schema={schemaData}
        mode={FBWorkspaceModeOptions.FORM}
        withoutBottomBar={true}
        autosave={autosaveEnabled}
        _formState={_formState}
        formInput={formInput}
        hideSideBar={hideSideBar}
        currentDocRevId={currentDocRevId}
        inDialog={inDialog}
      />
    ),
    [
      asyncState,
      changeRequest,
      doNotPrompt,
      setDoNotPrompt,
      setMDTab,
      schemaData,
      autosaveEnabled,
      _formState,
      formInput,
      hideSideBar,
      currentDocRevId,
      inDialog,
    ],
  );

  return (
    <FBProvider {...{ bookmarkState }}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <Formik
            initialValues={calcInitialValues}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {render}
          </Formik>
        </div>
      </div>
    </FBProvider>
  );
};

export default withSMForm(ChangeRequestFormContainer);
