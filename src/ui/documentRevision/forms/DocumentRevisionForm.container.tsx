import { Formik, FormikActions, FormikProps } from "formik";
import _ from "lodash";
import React from "react";
import { DocumentRevision, documentRevisionsSelectors, DocumentRevisionStatus, documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import DocumentRevisionFormPresenter from "./DocumentRevisionForm.presenter";
import { DocumentRevisionFormValues } from "./types";
import { ApplicationState } from "../../../state/reducers";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { connect } from "react-redux";
import AsyncGate from "../../components/AsyncGate";

interface StateProps {
  availableReferences: OptionType[];
  loadAsyncState: AsyncState;
  documentRevisions: DocumentRevision[];
}

interface DispatchProps {
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
}
interface OwnProps {
  initialValues: DocumentRevisionFormValues;
  asyncState: AsyncState;
  onSubmit: (values: DocumentRevisionFormValues, actions: FormikActions<DocumentRevisionFormValues>) => void;
  showRevisionTypeChange?: boolean;
}

type DocumentRevisionFormContainerProps = OwnProps & StateProps & DispatchProps;

const getAvailableReferences = documentRevisionsSelectors.makeGetAvailableReferences();
const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  availableReferences: getAvailableReferences(state, props.initialValues.changeRequest),
  loadAsyncState: documentRevisionsSelectors.getLoadListAsyncState(state),
  documentRevisions: documentRevisionsSelectors.getDocumentRevisionsList(state),
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
}) => {
    const render = (props: FormikProps<DocumentRevisionFormValues>) => (
      <DocumentRevisionFormPresenter
        {...props}
        asyncState={asyncState}
        documentRevisions={documentRevisions}
        availableReferences={availableReferences}
        showRevisionTypeChange={showRevisionTypeChange}
      />
    );

    const loadAction = () => loadDocumentRevisions(
      [DocumentRevisionStatus.Released, DocumentRevisionStatus.Deprecated, DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.PendingChange]
    );

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
})(DocumentRevisionFormContainer);
