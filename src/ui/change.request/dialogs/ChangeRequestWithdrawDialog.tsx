import Button, { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { changeRequestsActions, ChangeRequestTransition, ChangeRequestTransitionResponse } from "../../../state/ducks/changeRequest";
import AlertDialog from "../../app/alert.dialog/AlertDialog";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";

interface Props {
  buttonProps?: ButtonProps;
  label: string;
  transition: ChangeRequestTransition;
  changeRequestId: string;
}

export const ChangeRequestWithdrawDialog: React.FunctionComponent<Props> = ({
  buttonProps,
  label,
  changeRequestId,
  transition,
}) => {
  const dialog = useDialog();
  const applyTransition = useActionCreator(changeRequestsActions.applyTransition);
  const async = useAsync<ChangeRequestTransitionResponse>();
  const withdrawAction = () => {
    async.start(
      applyTransition,
      changeRequestId,
      { password: "" },
      transition,
      async,
    );
  };
  return (
    <>
      <Button
        color="secondary"
        variant="outlined"
        onClick={dialog.open}
        data-cy="change.request.withdraw.alert"
        {...buttonProps}
      >
        <Text message={label} />
      </Button>
      <AlertDialog
        confirmAction={withdrawAction}
        message={"change.request.withdraw.alert"}
        {...{ dialog }}
      />
    </>
  );
};

export default ChangeRequestWithdrawDialog;
