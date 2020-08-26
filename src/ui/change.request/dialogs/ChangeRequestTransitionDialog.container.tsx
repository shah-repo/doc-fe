import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { connect } from "react-redux";
import { changeRequestsActions, ChangeRequestTransition, ChangeRequestTransitionResponse } from "../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../state/reducers";
import TransitionDialog from "../../components/transitionDialog/TransitionDialog";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import { EffectiveDateFormValues, PasswordFormValues } from "../form/types";

interface OwnProps {
  changeRequestId: string;
  transition: ChangeRequestTransition;
  buttonProps?: ButtonProps;
  label: string;
  onSuccess?: () => void;
}

interface DispatchProps {
  applyTransition: typeof changeRequestsActions.applyTransition;
}

export type TransitionDialogContainerProps = OwnProps & DispatchProps;

export const TransitionDialogContainer: React.FunctionComponent<TransitionDialogContainerProps> = ({
  changeRequestId,
  applyTransition,
  transition,
  buttonProps,
  label,
  onSuccess,
}) => {
  const transitionDialog = useDialog();
  const effectiveDateDialog = useDialog();
  const async = useAsync<ChangeRequestTransitionResponse>({
    onSuccess: () => {
      onSuccess && onSuccess();
      transitionDialog.close();
    },
  });

  const openDialog = () => {
    async.reset();
    if (transition === "closed") {
      effectiveDateDialog.open();
    } else {
      transitionDialog.open();
    }
  };

  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    async.start(
      applyTransition,
      changeRequestId, values, transition, async,
    );
  };

  return (
    <TransitionDialog
      openDialog={openDialog}
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      buttonProps={buttonProps}
      transition={transition}
      label={label}
      { ...{
        transitionDialog,
        effectiveDateDialog,
      }}
    />
  );
};

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  applyTransition: changeRequestsActions.applyTransition,
})(TransitionDialogContainer);
