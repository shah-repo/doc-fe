import Button, { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { connect } from "react-redux";
import {
  changeRequestsActions,
  ChangeRequestTransition,
  ChangeRequestTransitionResponse,
} from "../../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../../state/reducers";
import { AsyncStatus } from "../../../../state/types";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import Text from "../../../components/Text";
import useAsync from "../../../hooks/useAsync";

interface OwnProps {
  transition: ChangeRequestTransition;
  label: string;
  changeRequestId: string;
  buttonProps?: ButtonProps;
}

interface DispatchProps {
  applyTransition: typeof changeRequestsActions.applyTransition;
}

export type Props = OwnProps & DispatchProps;

const TransitionButton: React.FunctionComponent<Props> = ({
  transition,
  label,
  applyTransition,
  changeRequestId,
  buttonProps,
}) => {
  const async = useAsync<ChangeRequestTransitionResponse>();
  const onClick = () => {
    async.start(
      applyTransition,
      changeRequestId,
      { password: "" },
      transition,
      async,
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
        {...buttonProps}
      >
        <Text message={label} />
      </Button>
    </React.Fragment>
  );
};

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(
  null,
  {
    applyTransition: changeRequestsActions.applyTransition,
  },
)(TransitionButton);
