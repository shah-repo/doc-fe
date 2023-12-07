import { cloneDeep, debounce, isEmpty } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { authSelectors } from '../../state/ducks/auth';
import { changeRequestsActions } from '../../state/ducks/changeRequest';
import { ChangeRequest, ChangeRequestStatus } from '../../state/ducks/changeRequest/types';
import { companyActions } from '../../state/ducks/company';
import { ApplicationState } from '../../state/reducers';
import ChangeRequestFormContainer from '../change.request/form/ChangeRequestForm.container';
import { toChangeRequestEditRequestBody, toChangeRequestFormValues } from '../change.request/form/transform';
import { ChangeRequestFormValues } from '../change.request/form/types';
import { changeRequestPreviewPath } from '../change.request/utils/paths';
import { FormContext } from '../components/forms/FormContext';
import { compareValuesToSubmit } from '../components/forms/helpers';
import { FB, FBFormState, FBProvider } from '../form.builder';
import FBDataStore from '../form.builder/FBStore/FBDataStore';
import useAsync from '../hooks/useAsync';
import { useCanUpdateChangeRequest } from './helpers';
import ChangeRequestSummaryContainer from './summary/container';

interface StateProps {
  currentUserEmail: string
}

interface DispatchProps {
  save: typeof changeRequestsActions.save
  loadAudit: typeof changeRequestsActions.loadAudit
  setAutosave: typeof companyActions.setAutosaveConfig
}

interface OwnProps {
  changeRequest: ChangeRequest
  hideSideBar?: boolean
  inDialog?: boolean
  currentDocRevId?: string
  isEditing?: boolean
}

type ChangeRequestUpdateContainerProps = OwnProps
& DispatchProps
& StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

const ChangeRequestUpdateContainer: React.FunctionComponent<ChangeRequestUpdateContainerProps> = ({
  changeRequest,
  currentDocRevId,
  currentUserEmail,
  hideSideBar = false,
  inDialog = false,
  isEditing = false,
  save,
  loadAudit,
  setAutosave,
}) => {
  const history = useHistory();
  const initialValues = useMemo(() => toChangeRequestFormValues(changeRequest), [changeRequest]);
  const [doNotPrompt, setDoNotPrompt] = React.useState(false);
  const [isMDTab, setMDTab] = React.useState(false);
  const canEditChangeRequest = useCanUpdateChangeRequest(changeRequest, isEditing);
  const formState = FB.useRef<FBFormState>(FBFormState, { initialValues: initialValues.formInput });
  const isInReview = changeRequest.state === ChangeRequestStatus.InReview;

  useEffect(() => {
    FBDataStore?.setRefreshData({
      ...FBDataStore?.refreshData,
      changeRequest: {
        ...FBDataStore?.refreshData?.changeRequest,
        formInput: initialValues.formInput,
      },
    });
    formState.setValues({ ...initialValues?.formInput } as FBFormState);
  }, [initialValues.formInput]);

  useEffect(() => {
    if (canEditChangeRequest && isEditing && isInReview) {
      setAutosave(false);
    }
    return () => {
      setAutosave(true);
    };
  }, [canEditChangeRequest, isEditing, isInReview, setAutosave]);

  const async = useAsync<ChangeRequest>({
    onSuccess: () => {
      setDoNotPrompt(true);
      FBDataStore?.setRefreshData({
        ...FBDataStore?.refreshData,
        changeRequest: { ...FBDataStore?.refreshData?.changeRequest, formInput: initialValues.formInput },
      });

      loadAudit(changeRequest.id);

      if (isEditing) {
        setAutosave(true);
        history.push(changeRequestPreviewPath(changeRequest.id));
      }
    },
  });

  if (!canEditChangeRequest || (isEditing && !isInReview)) {
    if (inDialog) {
      return (
        <ChangeRequestSummaryContainer
          changeRequest={changeRequest}
          currentUserEmail={currentUserEmail}
          hideSideBar={hideSideBar}
        />
      );
    }
    return <Redirect to={changeRequestPreviewPath(changeRequest.id)} />;
  }

  const frozenInitialValues = cloneDeep(initialValues);

  const onSubmit = (values: ChangeRequestFormValues) => {
    const dataToSubmit = compareValuesToSubmit(
      frozenInitialValues,
      {
        ...values,
        formInput: formState.getValues(),
      },
      toChangeRequestEditRequestBody,
    );

    if (isEmpty(dataToSubmit)) {
      if (isEditing && !isMDTab) {
        setDoNotPrompt(true);
        history.push(changeRequestPreviewPath(changeRequest.id));
      }
      return;
    }

    async.reset();

    async.start(
      save,
      changeRequest.id,
      dataToSubmit,
      async,
    );
  };

  const debouncedSubmit = debounce(onSubmit, 1000);

  return (
    <FormContext.Provider value={{ submitOnChange: true, isEditing }}>
      <FBProvider formState={formState}>
        <ChangeRequestFormContainer
          asyncState={async.asyncState}
          onSubmit={debouncedSubmit}
          initialValues={initialValues}
          changeRequest={changeRequest}
          doNotPrompt={doNotPrompt}
          setDoNotPrompt={setDoNotPrompt}
          setMDTab={setMDTab}
          hideSideBar={hideSideBar}
          currentDocRevId={currentDocRevId}
          inDialog={inDialog}
        />
      </FBProvider>
    </FormContext.Provider>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    save: changeRequestsActions.save,
    loadAudit: changeRequestsActions.loadAudit,
    setAutosave: companyActions.setAutosaveConfig,
  },
)(ChangeRequestUpdateContainer);
