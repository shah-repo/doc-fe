import { Formik, FormikActions, FormikProps } from "formik";
import _ from "lodash";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import DocumentRevisionFormPresenter from "./DocumentRevisionForm.presenter";
import { DocumentRevisionFormValues } from "./types";

interface OwnProps {
  initialValues: DocumentRevisionFormValues;
  asyncState: AsyncState;
  documentRevisions?: DocumentRevision[];
  onSubmit: (values: DocumentRevisionFormValues, actions: FormikActions<DocumentRevisionFormValues>) => void;
}

type DocumentRevisionFormContainerProps = OwnProps;

const DocumentRevisionFormContainer: React.FunctionComponent<DocumentRevisionFormContainerProps> = ({
  onSubmit,
  initialValues,
  asyncState,
  documentRevisions,
}) => {
    const render = (props: FormikProps<DocumentRevisionFormValues>) => (
      <DocumentRevisionFormPresenter
        {...props}
        asyncState={asyncState}
        documentRevisions={documentRevisions}
      />
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

export default DocumentRevisionFormContainer;
