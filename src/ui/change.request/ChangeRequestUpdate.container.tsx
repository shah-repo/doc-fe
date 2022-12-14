import { debounce, isEmpty } from "lodash";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { changeRequestsActions } from "../../state/ducks/changeRequest";
import { ChangeRequest, ChangeRequestEditRequestBody } from "../../state/ducks/changeRequest/types";
import { ApplicationState } from "../../state/reducers";
import ChangeRequestFormContainer from "../change.request/form/ChangeRequestForm.container";
import { toChangeRequestEditRequestBody, toChangeRequestFormValues } from "../change.request/form/transform";
import { ChangeRequestFormValues } from "../change.request/form/types";
import { changeRequestPreviewPath } from "../change.request/utils/paths";
import { FormContext } from "../components/forms/FormContext";
import { compareValuesToSubmit } from "../components/forms/helpers";
import { FBFormStateContext } from "../form.builder/FBForm/FBForm.wrap";
import useAsync from "../hooks/useAsync";
import { canEditChangeRequest } from "./helpers";


interface StateProps {
  currentUserEmail: string;
}

interface DispatchProps {
  save: typeof changeRequestsActions.save;
  loadAudit: typeof changeRequestsActions.loadAudit;
}

interface OwnProps {
  changeRequest: ChangeRequest;
  hideSideBar?: boolean;
  currentDocRevId?: string;
}

type ChangeRequestUpdateContainerProps = OwnProps &
DispatchProps &
StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

const ChangeRequestUpdateContainer: React.FunctionComponent<ChangeRequestUpdateContainerProps> = (
  { save, changeRequest, currentUserEmail, loadAudit, hideSideBar = false, currentDocRevId }) => {

  const initialValues = useMemo(() => toChangeRequestFormValues(changeRequest), [changeRequest]);
  const [doNotPrompt, setDoNotPrompt] = React.useState(false);

  const async = useAsync<ChangeRequest>({
    onSuccess: () => {
      setDoNotPrompt(true);
      loadAudit(changeRequest.id);
    },
  });
  if (!canEditChangeRequest(changeRequest, currentUserEmail)) {
    return <Redirect to={changeRequestPreviewPath(changeRequest.id)} />;
  }

  const onSubmit = (values: ChangeRequestFormValues) => {
    // Hack to take updated formInput
    const formStateContext = FBFormStateContext as any;
    const dataToSubmit = compareValuesToSubmit(
      initialValues,
      { ...values, formInput: formStateContext?._currentValue },
      toChangeRequestEditRequestBody
    );

    if (isEmpty(dataToSubmit)) {
      return;
    }

    async.reset();

    async.start(
      save,
      changeRequest.id,
      dataToSubmit as unknown as ChangeRequestEditRequestBody,
      async,
    );
  };

  const debouncedSubmit = debounce(onSubmit, 1000);

  return (
    <FormContext.Provider value={{ submitOnChange: true }}>
      <ChangeRequestFormContainer
        asyncState={async.asyncState}
        onSubmit={debouncedSubmit}
        initialValues={initialValues}
        changeRequest={changeRequest}
        doNotPrompt={doNotPrompt}
        hideSideBar={hideSideBar}
        currentDocRevId = {currentDocRevId}
      />
    </FormContext.Provider>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    save: changeRequestsActions.save,
    loadAudit: changeRequestsActions.loadAudit,
  },
)(ChangeRequestUpdateContainer);
