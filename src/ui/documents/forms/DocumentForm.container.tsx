import { Formik, FormikActions, FormikProps } from "formik";
import React, { useState } from "react";
import { connect } from "react-redux";
import { documentsActions } from "../../../state/ducks/documents";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import DocumentFormPresenter from "./DocumentForm.presenter";
import { DocumentFormValues } from "./types";

interface DispatchProps {
  resetFormAsyncState: typeof documentsActions.resetDocumentSaveAsyncStatus;
}

interface OwnProps {
  documentId?: string;
  initialValues: DocumentFormValues;
  asyncState: AsyncState;
  onSubmit: (values: DocumentFormValues, actions: FormikActions<DocumentFormValues>) => void;
}

type Props = OwnProps & DispatchProps;

const DocumentFormContainer: React.FunctionComponent<Props> =
  ({ resetFormAsyncState, onSubmit, initialValues, asyncState, documentId }) => {
    useState(() => resetFormAsyncState());

    const render = (props: FormikProps<DocumentFormValues>) => (
      <DocumentFormPresenter {...props} asyncState={asyncState} documentId={documentId} />
    );

    return (
      <Formik
        render={render}
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
      />
    );
  };

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  resetFormAsyncState: documentsActions.resetDocumentSaveAsyncStatus,
})(DocumentFormContainer);
