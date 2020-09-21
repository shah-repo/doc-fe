import Button, { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { changeRequestsActions, ChangeRequestTransition, ChangeRequestTransitionResponse } from "../../../../state/ducks/changeRequest";
import { AsyncStatus } from "../../../../state/types";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import Text from "../../../components/Text";
import { FB } from "../../../form.builder";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";

interface Props {
  transition: ChangeRequestTransition;
  label: string;
  changeRequestId: string;
  buttonProps?: ButtonProps;
}

const TransitionButton: React.FunctionComponent<Props> = ({
  transition,
  label,
  changeRequestId,
  buttonProps,
}) => {
  const applyTransition = useActionCreator(changeRequestsActions.applyTransition);
  const async = useAsync<ChangeRequestTransitionResponse>();

  const { formState } = FB.useStores();
  const onClick = () => {
    formState?.validate((valid) => {
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

  return (
    <React.Fragment>
      <FormMessage asyncState={async.asyncState} />
      <FormProgress asyncState={async.asyncState} />
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
    </React.Fragment>
  );
};

export default TransitionButton;
