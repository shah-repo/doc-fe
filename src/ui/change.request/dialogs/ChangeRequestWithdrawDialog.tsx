import Button, { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { SM } from "../../../App";
import { StyledButton } from "../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { StyledMenuListIcon } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon";
import { StyledMenuListItem } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import { ReactComponent as WithdrawSubmissionIcon } from "../../../assets/images/withdraw_submission.svg";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { ChangeRequestTransition, ChangeRequestTransitionResponse } from "../../../state/ducks/changeRequest/types";
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
  renderAsButton?: boolean;
}

const ChangeRequestWithdrawDialog: React.FunctionComponent<Props> = ({
  buttonProps,
  label,
  changeRequestId,
  transition,
  renderAsButton = false,
}) => {
  const isNewLayout = SM.isNewCRLayout || SM.isNewLayout;
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
      {isNewLayout ? (renderAsButton ? <StyledButton
        color="primary"  data-cy="change.request.withdraw.alert"
        id="OwnerChangerPresenter-changeOwner" onClick={dialog.open}>
        <Text message={label} />
      </StyledButton> :
        <StyledMenuListItem button alignItems="flex-start">
          <StyledMenuListIcon>
            <WithdrawSubmissionIcon />
          </StyledMenuListIcon>
          <StyledMenuListItemText
            id="OwnerChangerPresenter-changeOwner"
            data-cy="change.request.withdraw.alert"
            primary={<Text message={label} />}
            onClick={dialog.open}
          />
        </StyledMenuListItem>
      ) : (
        <Button
          color="secondary"
          variant="outlined"
          onClick={dialog.open}
          data-cy="change.request.withdraw.alert"
          {...buttonProps}
        >
          <Text message={label} />
        </Button>
      )}
      <AlertDialog
        confirmAction={withdrawAction}
        message={"change.request.withdraw.alert"}
        {...{ dialog }}
      />
    </>
  );
};

export default ChangeRequestWithdrawDialog;
