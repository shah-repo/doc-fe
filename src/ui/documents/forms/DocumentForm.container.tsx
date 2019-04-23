import { Formik, FormikActions, FormikProps } from "formik";
import React from "react";
import { AsyncState } from "../../../state/types";
import DocumentFormPresenter from "./DocumentForm.presenter";
import { DocumentFormValues } from "./types";

interface DocumentFormContainerProps {
  documentId?: string;
  initialValues: DocumentFormValues;
  asyncState: AsyncState;
  onSubmit: (values: DocumentFormValues, actions: FormikActions<DocumentFormValues>) => void;
}

const DocumentFormContainer: React.FunctionComponent<DocumentFormContainerProps> =
  ({ onSubmit, initialValues, asyncState, documentId }) => {
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

export default DocumentFormContainer;
