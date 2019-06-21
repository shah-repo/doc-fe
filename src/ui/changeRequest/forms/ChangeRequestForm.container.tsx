import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Grid } from "@material-ui/core";
import { ChangeRequestFormValues } from './types';
import DocumentRevisionControlContainer from '../documentRevision/DocumentRevisionControl.container';
import AssessmentFormContainer from './assessmentForm/AssessmentForm.container';
import { AsyncState } from '../../../state/types';
import { DocumentRevisionsByIdState, documentRevisionsSelectors } from '../../../state/ducks/documentRevisions';
import DocumentRevisionUpdateContainer from '../../documentRevision/DocumentRevisionUpdate.container';
import { ApplicationState } from '../../../state/reducers';
import { ChangeRequest } from '../../../state/ducks/changeRequest';

interface StateProps {
  documentRevisionsById: DocumentRevisionsByIdState;
}
interface OwnProps {
  initialValues: ChangeRequestFormValues;
  onSubmit: (values: ChangeRequestFormValues) => void;
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
}

type ChangeRequestFormContainerProps = OwnProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  documentRevisionsById: documentRevisionsSelectors.byId(state),
});

export const ChangeRequestFormContainer: React.FunctionComponent<ChangeRequestFormContainerProps> = ({
  onSubmit, asyncState, initialValues, documentRevisionsById, changeRequest,
}) => {
  const [initialValuesState, setInitialValuesState] = useState<ChangeRequestFormValues>(initialValues);
  const [selectedDocumentRevision, setSelectedDocumentRevision] = useState<string | null>(null);

  const doneAddingDocuments = (addedDocuments: string[]) => {
    const documentRevisions = new Set([...addedDocuments, ...initialValuesState.documentRevisions]);
    setInitialValuesState({
      ...initialValuesState,
      documentRevisions: Array.from(documentRevisions),
    });
  }

  const deleteDocumentFromChangeRequest = (deleteDocumentRevisionId: string) => {
    setInitialValuesState({
      ...initialValuesState,
      documentRevisions: initialValuesState.documentRevisions.filter((documentRevisionId) => documentRevisionId !== deleteDocumentRevisionId ),
    })
  }

  const selectDocumentRevision = (documentRevisionId: string) => {
    setSelectedDocumentRevision(documentRevisionId)
  }

  const selectAssessmentForm = () => {
    setSelectedDocumentRevision(null);
  }

  const renderAssessmentForm = () => {
    if (selectedDocumentRevision) {
      return null;
    }

    return (
      <AssessmentFormContainer
        initialValues={initialValuesState}
        onSubmit={onSubmit}
        asyncState={asyncState}
        changeRequest={changeRequest}
      />
    )
  }

  const renderDocumentRevisionForm = () => {
    if (!selectedDocumentRevision) {
      return null;
    }

    return (
      <DocumentRevisionUpdateContainer documentRevision={documentRevisionsById[selectedDocumentRevision]} />
    )
  }

  return (
    <Grid container={true}>
      <Grid item={true} xs={2}>
        <DocumentRevisionControlContainer
          doneAddingDocuments={doneAddingDocuments}
          documentsInChangeRequest={initialValuesState.documentRevisions}
          deleteDocumentFromChangeRequest={deleteDocumentFromChangeRequest}
          selectDocumentRevision={selectDocumentRevision}
          selectAssessmentForm={selectAssessmentForm}
          selectedDocumentRevision={selectedDocumentRevision}
        />
      </Grid>
      <Grid item={true} xs={10}>
        {renderAssessmentForm()}
        {renderDocumentRevisionForm()}
      </Grid>
    </Grid>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps, {})(ChangeRequestFormContainer);
