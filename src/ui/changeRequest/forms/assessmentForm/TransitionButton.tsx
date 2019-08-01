import React from "react";
import Button from "@material-ui/core/Button";
import Text from "../../../components/Text";
import { connect } from "react-redux";
import { changeRequestsActions, ChangeRequestTransition, ChangeRequestTransitionResponse } from "../../../../state/ducks/changeRequest";
import useAsync from "../../../hooks/useAsync";
import { ApplicationState } from "../../../../state/reducers";
import { AsyncStatus } from "../../../../state/types";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";

interface OwnProps {
  transition: ChangeRequestTransition;
  label: string;
  changeRequestId: string;
}

interface DispatchProps {
  applyTransition: typeof changeRequestsActions.applyTransition;
}

export type Props = OwnProps & DispatchProps;

const TransitionButton: React.FunctionComponent<Props> = ({
  transition, label, applyTransition, changeRequestId,
}) => {
  const async = useAsync<ChangeRequestTransitionResponse>();
  const onClick = () => {
    async.start(
      applyTransition,
      changeRequestId, { password: "" }, transition, async,
    );
  };

  return (
    <React.Fragment>
      <FormMessage asyncState={async.asyncState} />
      <FormProgress asyncState={async.asyncState} />
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        disabled={async.asyncState.status === AsyncStatus.Active}
      >
        <Text message={label} />
      </Button>
    </React.Fragment>
  );
};

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  applyTransition: changeRequestsActions.applyTransition,
})(TransitionButton);
