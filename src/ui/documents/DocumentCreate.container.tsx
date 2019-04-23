import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Document, documentsActions } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import useAsync from "../hooks/useAsync";
import DocumentFormContainer from "./forms/DocumentForm.container";
import { toDocumentEditRequestBody, toDocumentFormValues } from "./forms/transform";
import { DocumentFormValues } from "./forms/types";
import { generateDocumentEditPath } from "./pathGenerators";

interface DispatchProps {
  create: typeof documentsActions.create;
}

interface OwnProps extends RouteComponentProps {
  document?: Document;
}

export type DocumentCreateContainerProps = OwnProps & DispatchProps;

export const DEFAULT_INITIAL_VALUES = {
  name: "",
  type: "",
  approvers: [],
  attachments: [],
};

export const DocumentCreateContainer: React.FunctionComponent<DocumentCreateContainerProps> =
  ({ create, history, document }) => {
    const async = useAsync<Document>({
      onSuccess: (createdDocument?) => {
        history.push(generateDocumentEditPath(createdDocument!.id));
      },
    });

    const onSubmit = (values: DocumentFormValues) => {
      async.start(create, toDocumentEditRequestBody(values), async);
    };

    const initialValues: DocumentFormValues = document ? toDocumentFormValues(document) : DEFAULT_INITIAL_VALUES;

    return (
      <DocumentFormContainer asyncState={async.asyncState} onSubmit={onSubmit} initialValues={initialValues} />
    );
  };

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  create: documentsActions.create,
})(DocumentCreateContainer);
