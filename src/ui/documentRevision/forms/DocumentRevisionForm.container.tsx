import { Formik, FormikActions, FormikProps } from "formik";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { DocumentRevision, documentRevisionsActions, documentRevisionsSelectors, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { documentsActions, documentsSelectors } from "../../../state/ducks/documents";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import DocumentRevisionFormPresenter from "./DocumentRevisionForm.presenter";
import { DocumentRevisionFormValues } from "./types";

interface StateProps {
  availableReferences: OptionType[];
  loadAsyncState: AsyncState;
  documentRevisions: DocumentRevision[];
  proposedDocId: string;
}

interface DispatchProps {
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
  loadDocumentProposedId: typeof documentsActions.loadDocumentProposedId;
}
interface OwnProps {
  initialValues: DocumentRevisionFormValues;
  asyncState: AsyncState;
  onSubmit: (values: DocumentRevisionFormValues, actions: FormikActions<DocumentRevisionFormValues>) => void;
  showRevisionTypeChange?: boolean;
}

type DocumentRevisionFormContainerProps = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  availableReferences: documentRevisionsSelectors.getAvailableReferences(state),
  loadAsyncState: documentRevisionsSelectors.getLoadListAsyncState(state),
  documentRevisions: documentRevisionsSelectors.getDocumentRevisionsList(state),
  proposedDocId: documentsSelectors.getProposedDocId(state),
});

export const DocumentRevisionFormContainer: React.FunctionComponent<DocumentRevisionFormContainerProps> = ({
  onSubmit,
  initialValues,
  asyncState,
  documentRevisions,
  availableReferences,
  showRevisionTypeChange,
  loadDocumentRevisions,
  loadAsyncState,
  loadDocumentProposedId,
  proposedDocId,
}) => {

    const render = (props: FormikProps<DocumentRevisionFormValues>) => {
      return (
        <DocumentRevisionFormPresenter
          {...props}
          asyncState={asyncState}
          documentRevisions={documentRevisions}
          availableReferences={availableReferences}
          showRevisionTypeChange={showRevisionTypeChange}
          loadDocumentProposedId={loadDocumentProposedId}
          proposedDocId={proposedDocId}
        />
      );
    };

    const loadAction = () => loadDocumentRevisions([DocumentRevisionStatus.Released, DocumentRevisionStatus.Deprecated, DocumentRevisionStatus.Obsolete]);
    return (
      <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
        <Formik
          render={render}
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize={true}
        />
      </AsyncGate>
    );
  };

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadDocumentRevisions: documentRevisionsActions.loadList,
  loadDocumentProposedId: documentsActions.loadDocumentProposedId,
})(DocumentRevisionFormContainer);
