import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { connect } from "react-redux";
import { changeRequestsActions, ChangeRequestTransition, ChangeRequestTransitionResponse } from "../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../state/reducers";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import { PasswordFormValues } from "../forms/types";
import TransitionDialog from "../../components/transitionDialog/TransitionDialog";

interface OwnProps {
  changeRequestId: string;
  transition: ChangeRequestTransition;
  buttonProps?: ButtonProps;
}

interface DispatchProps {
  applyTransition: typeof changeRequestsActions.applyTransition;
}

export type TransitionDialogContainerProps = OwnProps & DispatchProps;

export const TransitionDialogContainer: React.FunctionComponent<TransitionDialogContainerProps> = ({
  changeRequestId, applyTransition, transition, buttonProps,
}) => {
  const dialog = useDialog();
  const async = useAsync<ChangeRequestTransitionResponse>({ onSuccess: dialog.close });

  const openDialog = () => {
    async.reset();
    dialog.open();
  };

  const onSubmit = (values: PasswordFormValues) => {
    async.start(
      applyTransition,
      changeRequestId, values, transition, async,
    );
  };

  return (
    <TransitionDialog
      isDialogOpen={dialog.isOpen}
      openDialog={openDialog}
      closeDialog={dialog.close}
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      buttonProps={buttonProps}
      transition={transition}
    />
  );
};

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  applyTransition: changeRequestsActions.applyTransition,
})(TransitionDialogContainer);
