import { cloneDeep, debounce, isEmpty, isEqual, isNull, omitBy } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { saveApprovalRequest } from '../../App/Shifamed/Utils/API';
import { authSelectors } from '../../state/ducks/auth';
import { changeRequestsActions, changeRequestsSelectors } from '../../state/ducks/changeRequest';
import { ChangeRequest, ChangeRequestStatus } from '../../state/ducks/changeRequest/types';
import { companyActions, companySelectors } from '../../state/ducks/company';
import { ApplicationState } from '../../state/reducers';
import ChangeRequestFormContainer from '../change.request/form/ChangeRequestForm.container';
import { toChangeRequestEditRequestBody, toChangeRequestFormValues } from '../change.request/form/transform';
import { ChangeRequestFormValues } from '../change.request/form/types';
import { changeRequestPreviewPath } from '../change.request/utils/paths';
import { FormContext } from '../components/forms/FormContext';
import { compareValuesToSubmit } from '../components/forms/helpers';
import { toastError } from '../components/notifications';
import { FB, FBFormState, FBProvider, FBWorkspaceState } from '../form.builder';
import FBDataStore from '../form.builder/FBStore/FBDataStore';
import FBStore from '../form.builder/FBStore/FBStore';
import { useRestrictedEditUpdates } from './FBMaterialDisposition/components/FBTasksListTable/useRestrictedEditUpdates';
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

type ChangeRequestUpdateContainerProps = OwnProps & DispatchProps & StateProps;

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
  const initialValues = useMemo(() => toChangeRequestFormValues(changeRequest), [changeRequest]);
  const [doNotPrompt, setDoNotPrompt] = React.useState(false);
  const [isMDTab, setMDTab] = React.useState(false);
  const canEditChangeRequest = useCanUpdateChangeRequest(changeRequest, isEditing);
  const formState = FB.useRef<FBFormState>(FBFormState, { initialValues: initialValues.formInput });
  const lhrBuildTypeConfig = useSelector(companySelectors.getLHRBuildTypeConfig);
  const workspaceState = FB.useRef<FBWorkspaceState>(FBWorkspaceState, { lhrBuildTypeConfig });
  const isInReview = changeRequest.state === ChangeRequestStatus.InReview;
  const updatingAsyncState = useSelector(changeRequestsSelectors.getUpdateAsyncState);
  const { triggerRestrictEditUpdates, isLoading } = useRestrictedEditUpdates(changeRequest?.id);

  useEffect(() => {
    const isItemsRevDataSame = isEqual(initialValues?.formInput?.documentRevisions, formState.getValues()?.documentRevisions);
    const isStoreFormInputSame = isEqual(
    FBDataStore?.refreshData?.changeRequest?.formInput,
    initialValues?.formInput,
    );

    if (!isStoreFormInputSame) {
      FBDataStore?.setRefreshData({
        ...FBDataStore?.refreshData,
        changeRequest: {
          ...FBDataStore?.refreshData?.changeRequest,
          formInput: initialValues.formInput,
        },
      });
    }

    if (!isItemsRevDataSame) {
      formState.setValues(initialValues?.formInput ?? {});
    }
  }, [initialValues.formInput]);

  useEffect(() => {
    if (canEditChangeRequest && isEditing && isInReview) {
      setAutosave(false);
    }
    return () => {
      setAutosave(true);
    };
  }, [canEditChangeRequest, isEditing, isInReview, setAutosave]);

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
    const updatedValues = omitBy(formState.getValues(), isNull);

    const dataToSubmit = compareValuesToSubmit(
      {
        ...frozenInitialValues,
        formInput: {
          ...frozenInitialValues.formInput,
          ...(!isEmpty(frozenInitialValues.formInput?.effectiveDate) ? { effectiveDate: frozenInitialValues.formInput?.effectiveDate } : {}),
        },
      },
      {
        ...values,
        formInput: {
          ...updatedValues,
          ...(!isEmpty(updatedValues.formInput?.effectiveDate) ? { effectiveDate: updatedValues.formInput?.effectiveDate } : {}),
        },
      },
      toChangeRequestEditRequestBody,
    );

    if (isEmpty(dataToSubmit)) {
      if (isEditing && !isMDTab) {
        setDoNotPrompt(true);
        triggerRestrictEditUpdates();
      }
      return;
    }

    saveApprovalRequest(changeRequest.id, dataToSubmit)
      .then(() => {
        setDoNotPrompt(true);
        FBDataStore?.setRefreshData({
          ...FBDataStore?.refreshData,
          changeRequest: {
            ...FBDataStore?.refreshData?.changeRequest,
            formInput: initialValues.formInput,
          },
        });

        if (FBStore?.isHistoryTabSelected) {
          loadAudit(changeRequest.id);
        }

        if (isEditing) {
          setAutosave(true);
          triggerRestrictEditUpdates();
        }
      })
      .catch(toastError);
  };

  const debouncedSubmit = debounce(onSubmit, 1000);

  return (
    <FormContext.Provider value={{ submitOnChange: true, isEditing, isLoading }}>
      <FBProvider formState={formState} workspaceState={workspaceState}>
        <ChangeRequestFormContainer
          asyncState={updatingAsyncState}
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
