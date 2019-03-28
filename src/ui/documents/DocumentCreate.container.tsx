import { FormikActions } from "formik";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Document, documentsActions, documentsSelectors } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import useCallbackHandler from "../hooks/useCallbackHandler";
import DocumentFormContainer from "./forms/DocumentForm.container";
import { toDocumentEditRequestBody, toDocumentFormValues } from "./forms/transform";
import { DocumentFormValues } from "./forms/types";
import { generateDocumentEditPath } from "./pathGenerators";

interface StateProps {
  asyncState: AsyncState;
}

interface DispatchProps {
  create: typeof documentsActions.create;
}

interface OwnProps extends RouteComponentProps {
  document?: Document;
}

export type DocumentCreateContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  asyncState: documentsSelectors.getSaveAsyncState(state),
});

export const DEFAULT_INITIAL_VALUES = {
  name: "",
  type: "",
  approvers: [],
  attachments: [],
};

export const DocumentCreateContainer: React.FunctionComponent<DocumentCreateContainerProps> =
  ({ create, asyncState, history, document }) => {
    const successHandler = useCallbackHandler<Document>((createdDocument) => {
      history.push(generateDocumentEditPath(createdDocument.id));
    });

    const onSubmit = (values: DocumentFormValues, actions: FormikActions<DocumentFormValues>) => {
      create(toDocumentEditRequestBody(values), successHandler);
      actions.setSubmitting(false);
    };

    const initialValues: DocumentFormValues = document ? toDocumentFormValues(document) : DEFAULT_INITIAL_VALUES;

    return (
      <DocumentFormContainer asyncState={asyncState} onSubmit={onSubmit} initialValues={initialValues} />
    );
  };

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  create: documentsActions.create,
})(DocumentCreateContainer);
