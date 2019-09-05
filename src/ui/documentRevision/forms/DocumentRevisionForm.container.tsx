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
import ChangeRequestLink from "../../document.revision/summary/changeRequestLink";
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
  setDocId?: typeof documentsActions.setDocumentProposedId;
  doNotPrompt?: boolean;
  onDirtyFlagChange?: (dirty: boolean) => void;
  documentRevision: DocumentRevision;
}

type DocumentRevisionFormContainerProps = OwnProps & StateProps & DispatchProps;

const getAvailableReferences = documentRevisionsSelectors.makeGetAvailableReferences();
const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  availableReferences: getAvailableReferences(state, props.initialValues),
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
  setDocId,
  doNotPrompt,
  onDirtyFlagChange,
  documentRevision,
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
          setDocId={setDocId}
          doNotPrompt={doNotPrompt}
          onDirtyFlagChange={onDirtyFlagChange}
        />
      );
    };

    const loadAction = () => loadDocumentRevisions(
      [
        DocumentRevisionStatus.Released,
        DocumentRevisionStatus.Deprecated,
        DocumentRevisionStatus.Obsolete,
        DocumentRevisionStatus.PendingChange,
        DocumentRevisionStatus.Draft,
      ],
    );

    return (
      <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
        <div style={{marginLeft: -16}}>
          <ChangeRequestLink dataProp={documentRevision} />
        </div>
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
