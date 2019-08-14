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
import { ChangeRequest, changeRequestsSelectors, ChangeRequestsByIdState } from '../../../state/ducks/changeRequest';
import ChangeRequestAuditContainer from '../audit/Audit.container';
import DocumentRevisionAuditContainer from '../../documentRevision/audit/Audit.container';

interface StateProps {
  documentRevisionsById: DocumentRevisionsByIdState;
  changeRequestsById: ChangeRequestsByIdState;
}
interface OwnProps {
  initialValues: ChangeRequestFormValues;
  onSubmit: (values: ChangeRequestFormValues) => void;
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
}

type ChangeRequestFormContainerProps = OwnProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  documentRevisionsById: documentRevisionsSelectors.byId(state),
  changeRequestsById: changeRequestsSelectors.byId(state),
});

export const ChangeRequestFormContainer: React.FunctionComponent<ChangeRequestFormContainerProps> = ({
  onSubmit, asyncState, initialValues, documentRevisionsById, changeRequest,
  doNotPrompt, changeRequestsById,
}) => {
  const alertMessage = "You have unsaved changes.";
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [selectedDocumentRevision, setSelectedDocumentRevision] = useState<string | null>(null);
  const [documentRevisionsList, setDocumentRevisionsList] = useState<string[]>(initialValues.documentRevisions);

  const doneAddingDocuments = (addedDocuments: string[]) => {
    const documentRevisions = new Set([...addedDocuments, ...documentRevisionsList]);
    setDocumentRevisionsList(Array.from(documentRevisions));
  }

  const deleteDocumentFromChangeRequest = (deleteDocumentRevisionId: string) => {
    setDocumentRevisionsList(documentRevisionsList.filter((documentRevisionId) => documentRevisionId !== deleteDocumentRevisionId ));
  }

  const selectDocumentRevision = (documentRevisionId: string) => {
    if (isFormDirty) {
      alert(alertMessage);
      return;
    }
    setSelectedDocumentRevision(documentRevisionId);
  }

  const selectAssessmentForm = () => {
    if (isFormDirty) {
      alert(alertMessage);
      return;
    }
    setSelectedDocumentRevision(null)
  };

  const onDirtyFlagChange = (dirty: boolean) => setIsFormDirty(dirty);

  const renderAssessmentForm = () => {
    return (
      <AssessmentFormContainer
        initialValues={initialValues}
        onSubmit={onSubmit}
        asyncState={asyncState}
        changeRequest={changeRequest}
        documentRevisionsList={documentRevisionsList}
        doNotPrompt={doNotPrompt}
        onDirtyFlagChange={onDirtyFlagChange}
      />
    )
  }

  const renderDocumentRevisionForm = () => {
    if (selectedDocumentRevision) {
      const docRev = {
        ...documentRevisionsById[selectedDocumentRevision],
        changeRequest: initialValues.id ? changeRequestsById[initialValues.id] : undefined,
      }
      return (
        <DocumentRevisionUpdateContainer
          documentRevision={docRev}
          onDirtyFlagChange={onDirtyFlagChange}
        />
      );
    }
  }

  const renderChangeRequestAudit = () => {
    if (changeRequest) {
      return <ChangeRequestAuditContainer changeRequestId={changeRequest.id} />
    }
  }

  const renderDocumentRevisionAudit = () => {
    if (selectedDocumentRevision) {
      return <DocumentRevisionAuditContainer documentRevisionId={selectedDocumentRevision} />
    }
  }

  return (
    <Grid container={true}>
      <Grid item={true} xs={2}>
        <DocumentRevisionControlContainer
          doneAddingDocuments={doneAddingDocuments}
          documentsInChangeRequest={documentRevisionsList}
          deleteDocumentFromChangeRequest={deleteDocumentFromChangeRequest}
          selectDocumentRevision={selectDocumentRevision}
          selectAssessmentForm={selectAssessmentForm}
          selectedDocumentRevision={selectedDocumentRevision}
        />
      </Grid>
      <Grid item={true} xs={7}>
        {!selectedDocumentRevision && renderAssessmentForm()}
        {renderDocumentRevisionForm()}
      </Grid>
      <Grid item={true} xs={3}>
        {renderDocumentRevisionAudit()}
        {renderChangeRequestAudit()}
      </Grid>
    </Grid>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps, {})(ChangeRequestFormContainer);
