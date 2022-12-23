import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { useDispatch } from "react-redux";
import { changeRequestsActions } from "../../../../state/ducks/changeRequest";
import {
  ChangeRequestTransition,
  ChangeRequestTransitionResponse,
} from "../../../../state/ducks/changeRequest/types";
import { dashboardMyFeedsActions } from "../../../../state/ducks/dashboard.new/my.feeds";
import { dashboardTodoActions } from "../../../../state/ducks/dashboard.new/todo";
import {
  EffectiveDateFormValues,
  PasswordFormValues,
} from "../../../change.request/form/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import TransitionDialog from "./transitionDialog/TransitionDialog";

interface Props {
  changeRequestId: string;
  transition: ChangeRequestTransition;
  buttonProps?: ButtonProps;
  arId?: string;
  title?: string;
  label: string;
  transitionDialog: any;
  onSuccess?: () => void;
}

const ApproveDialogueContainer: React.FunctionComponent<Props> = ({
  changeRequestId,
  arId,
  title,
  transition,
  buttonProps,
  label,
  transitionDialog,
  onSuccess,
}) => {
  const effectiveDateDialog = useDialog();
  const applyTransitionAction = useActionCreator(
    changeRequestsActions.applyTransition
  );
  const dispatch = useDispatch();

  const async = useAsync<ChangeRequestTransitionResponse>({
    onSuccess: () => {
      onSuccess && onSuccess();

      effectiveDateDialog.close();
      transitionDialog.close();

      dispatch(dashboardTodoActions.loadMyFeedsList());
      dispatch(dashboardMyFeedsActions.loadMyFeedsList());
    },
    onError: () => {
      transitionDialog.close();
    },
  });

  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    async.start(
      applyTransitionAction,
      changeRequestId,
      values,
      transition,
      async
    );
  };

  return (
    <TransitionDialog
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      buttonProps={buttonProps}
      transition={transition}
      arId={arId}
      title={title}
      label={label}
      {...{
        transitionDialog,
        effectiveDateDialog,
      }}
    />
  );
};

export default ApproveDialogueContainer;
