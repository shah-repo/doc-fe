import Button, { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { SM } from "../../../../App";
import { StyledButton } from "../../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { changeRequestsActions } from "../../../../state/ducks/changeRequest";
import { ChangeRequestTransition, ChangeRequestTransitionResponse } from "../../../../state/ducks/changeRequest/types";
import { AsyncStatus } from "../../../../state/types";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";

interface Props {
  transition: ChangeRequestTransition;
  label: string;
  changeRequestId: string;
  buttonProps?: ButtonProps;
  isSubmitButtonShown?: boolean;
}

const TransitionButton: React.FunctionComponent<Props> = ({
  transition,
  label,
  changeRequestId,
  buttonProps,
  isSubmitButtonShown = false,
}) => {
  const applyTransition = useActionCreator(changeRequestsActions.applyTransition);
  const async = useAsync<ChangeRequestTransitionResponse>();
  const isNewLayout = SM.isNewCRLayout;
  const { _formState } = SM.useStores();

  const onClick = () => {
    _formState?.validate((valid) => {
      if (valid) {
        async.start(
          applyTransition,
          changeRequestId,
          { password: "" },
          transition,
          async,
        );
      }
    });
  };

  if (isSubmitButtonShown) {
    return (
      <React.Fragment>
        <FormMessage asyncState={async.asyncState} />
        <FormProgress asyncState={async.asyncState} />
        <SubmitButton
          id="transitionButton"
          showNewButton={true}
          asyncState={async.asyncState}
          onClick={onClick}
          dataCy={label}
          label={label} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <FormMessage asyncState={async.asyncState} />
      <FormProgress asyncState={async.asyncState} />
      {isNewLayout ? (
        <StyledButton
          id="transitionButton"
          data-cy="transitionButton"
          color="primary"
          onClick={onClick}
          disabled={async.asyncState.status === AsyncStatus.Active}
          {...buttonProps}
        >
          <Text message={label} />
        </StyledButton>
      ) : (
        <Button
          id="transitionButton"
          data-cy="transitionButton"
          color="secondary"
          variant="outlined"
          onClick={onClick}
          disabled={async.asyncState.status === AsyncStatus.Active}
          {...buttonProps}
        >
          <Text message={label} />
        </Button>
      )}
    </React.Fragment>
  );
};

export default TransitionButton;
