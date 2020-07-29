import { isEmpty } from "lodash";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { ChangeRequest, ChangeRequestEditRequestBody, changeRequestsActions } from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
import ChangeRequestFormContainer from "../change.request/form/ChangeRequestForm.container";
import { toChangeRequestEditRequestBody, toChangeRequestFormValues } from "../change.request/form/transform";
import { ChangeRequestFormValues } from "../change.request/form/types";
import { changeRequestPreviewPath } from "../change.request/utils/paths";
import { FormContext } from "../components/forms/FormContext";
import { compareValuesToSubmit } from "../components/forms/helpers";
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
}

export type ChangeRequestUpdateContainerProps = OwnProps &
DispatchProps &
StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const ChangeRequestUpdateContainer: React.FunctionComponent<
ChangeRequestUpdateContainerProps
> = ({ save, changeRequest, currentUserEmail, loadAudit }) => {

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
    const dataToSubmit = compareValuesToSubmit(initialValues, values, toChangeRequestEditRequestBody);

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

  return (
    <FormContext.Provider value={{ submitOnChange: true }}>
      <ChangeRequestFormContainer
        asyncState={async.asyncState}
        onSubmit={onSubmit}
        initialValues={initialValues}
        changeRequest={changeRequest}
        doNotPrompt={doNotPrompt}
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
