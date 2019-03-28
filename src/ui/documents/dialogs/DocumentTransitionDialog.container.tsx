import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { connect } from "react-redux";
import { documentsActions, DocumentTransition } from "../../../state/ducks/documents";
import { ApplicationState } from "../../../state/reducers";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import { PasswordFormValues } from "../forms/types";
import DocumentTransitionDialogPresenter from "./DocumentTransitionDialog.presenter";

interface OwnProps {
  documentId: string;
  transition: DocumentTransition;
  buttonProps?: ButtonProps;
}

interface DispatchProps {
  applyTransition: typeof documentsActions.applyTransition;
}

type Props = OwnProps & DispatchProps;

const DocumentTransitionDialogContainer: React.FunctionComponent<Props> = ({
  documentId, applyTransition, transition, buttonProps,
}) => {
  const dialog = useDialog();
  const async = useAsync<string>({ onSuccess: dialog.close });

  const onSubmit = (values: PasswordFormValues) => {
    async.start(
      applyTransition,
      documentId, values, transition, async.successHandler, async.errorHandler,
    );
  };

  return (
    <DocumentTransitionDialogPresenter
      isDialogOpen={dialog.isOpen}
      openDialog={dialog.open}
      closeDialog={dialog.close}
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      buttonProps={buttonProps}
      transition={transition}
    />
  );
};

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  applyTransition: documentsActions.applyTransition,
})(DocumentTransitionDialogContainer);
