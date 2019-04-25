import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { connect } from "react-redux";
import { documentsActions, DocumentTransition, DocumentTransitionResponse } from "../../../state/ducks/documents";
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

export type DocumentTransitionDialogContainerProps = OwnProps & DispatchProps;

export const DocumentTransitionDialogContainer: React.FunctionComponent<DocumentTransitionDialogContainerProps> = ({
  documentId, applyTransition, transition, buttonProps,
}) => {
  const dialog = useDialog();
  const async = useAsync<DocumentTransitionResponse>({ onSuccess: dialog.close });

  const openDialog = () => {
    async.reset();
    dialog.open();
  };

  const onSubmit = (values: PasswordFormValues) => {
    async.start(
      applyTransition,
      documentId, values, transition, async,
    );
  };

  return (
    <DocumentTransitionDialogPresenter
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
  applyTransition: documentsActions.applyTransition,
})(DocumentTransitionDialogContainer);
