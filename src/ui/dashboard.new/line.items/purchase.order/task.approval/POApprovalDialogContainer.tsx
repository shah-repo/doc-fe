import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { ChangeRequestTransition } from "../../../../../state/ducks/changeRequest/types";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import { PasswordFormValues } from "../../dialogs/transitionDialog/types";
import { approvalsActions } from "../../../../../state/ducks/approvals";
import { toastError } from "../../../../components/notifications";
import ApproveOrRejectDialog from "../../dialogs/transitionDialog/ApproveOrRejectDialog";

interface Props {
  approvalId: string;
  transition: ChangeRequestTransition;
  buttonProps?: ButtonProps;
  label: string;
  transitionDialog: any;
  onSuccess?: () => void;
}

const ApproveDialogueContainer: React.FunctionComponent<Props> = ({
  approvalId,
  transition,
  buttonProps,
  label,
  transitionDialog,
  onSuccess,
}) => {
  const async = useAsync({
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error) => {
      toastError(error as string);
    },
  });
  const applyTransition = useActionCreator(approvalsActions.applyTransition);
  const onSubmit = (props: PasswordFormValues) => {
    async.start(applyTransition, approvalId, transition, async, props.password);
  };

  return (
    <ApproveOrRejectDialog
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      buttonProps={buttonProps}
      transition={transition}
      label={label}
      {...{
        transitionDialog,
      }}
    />
  );
};

export default ApproveDialogueContainer;
