import React, { useState } from "react";
import Button from "@material-ui/core/Button";

import Text from "../../components/Text";
import AddDocumentRevisionContainer from "./AddDocumentRevision.container";
import { AsyncState } from "../../../state/types";
import {
  DocumentRevision,
  DocumentRevisionsByIdState,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../../state/ducks/documentRevisions";
import AsyncGate from "../../components/AsyncGate";
import { connect } from "react-redux";
import { ApplicationState } from "../../../state/reducers";
import styles from "./DocumentRevisionControl.styles";
import { withStyles, WithStyles, Icon } from "@material-ui/core";
import DocumentRevisionItemPresenter from "./DocumentRevisionItem.presenter";
import { AddCircleRounded } from "@material-ui/icons";

interface StateProps {
  loadDocumentRevisionsAsyncState: AsyncState;
  documentRevisionsList: DocumentRevision[];
  documentRevisionsById: DocumentRevisionsByIdState;
}

interface DispatchProps {
  loadDocumentRevisionsAction: typeof documentRevisionsActions.loadList;
}

interface OwnProps {
  doneAddingDocuments: (addedDocuments: string[]) => void;
  documentsInChangeRequest: string[];
  deleteDocumentFromChangeRequest: (documentRevisionId: string) => void;
  selectDocumentRevision: (documentRevisionId: string) => void;
  selectAssessmentForm: () => void;
  selectedDocumentRevision: string | null;
}

export type DocumentRevisionControlContainerProps = OwnProps &
  DispatchProps &
  StateProps &
  WithStyles<typeof styles>;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  loadDocumentRevisionsAsyncState: documentRevisionsSelectors.getLoadListAsyncState(
    state,
  ),
  documentRevisionsList: documentRevisionsSelectors.getDocumentRevisionsList(
    state,
  ),
  documentRevisionsById: documentRevisionsSelectors.byId(state),
});

export const DocumentRevisionControlContainer: React.FunctionComponent<
  DocumentRevisionControlContainerProps
> = ({
  doneAddingDocuments,
  documentsInChangeRequest,
  loadDocumentRevisionsAsyncState,
  loadDocumentRevisionsAction,
  documentRevisionsList,
  deleteDocumentFromChangeRequest,
  selectDocumentRevision,
  selectAssessmentForm,
  classes,
  documentRevisionsById,
  selectedDocumentRevision,
}) => {
  const [showAddDocuments, setShowAddDocuments] = useState(false);

  const openAddDocuments = () => setShowAddDocuments(true);
  const closeAddDocuments = () => setShowAddDocuments(false);

  const renderDocumentRevisions = () =>
    documentsInChangeRequest.map(documentRevisionId => (
      <DocumentRevisionItemPresenter
        key={documentRevisionId}
        documentRevision={documentRevisionsById[documentRevisionId]}
        onDelete={() => deleteDocumentFromChangeRequest(documentRevisionId)}
        onClick={() => selectDocumentRevision(documentRevisionId)}
        selectedDocumentRevision={selectedDocumentRevision!}
      />
    ));

  return (
    <AsyncGate
      asyncState={loadDocumentRevisionsAsyncState}
      asyncAction={loadDocumentRevisionsAction}
      startActionOnMount={true}>
      <div className={classes.container}>
        <Button
          variant="contained"
          color="primary"
          onClick={selectAssessmentForm}
          fullWidth
          className={classes.assessmentFormButton}>
          <Text translation="changeRequest.documentControl.changeRequestForm" />
        </Button>
        <div className={classes.documentRevisionContainer}>
          {renderDocumentRevisions()}
        </div>
        <Button
          variant="text"
          color="primary"
          onClick={openAddDocuments}
          fullWidth>
          <Icon className={classes.leftIcon}>
            <AddCircleRounded />
          </Icon>
          <Text translation="changeRequest.documentControl.addDocuments" />
        </Button>
        <AddDocumentRevisionContainer
          isOpen={showAddDocuments}
          close={closeAddDocuments}
          doneAddingDocuments={doneAddingDocuments}
          documentsInChangeRequest={documentsInChangeRequest}
          documentRevisionsList={documentRevisionsList}
          documentRevisionsById={documentRevisionsById}
        />
      </div>
    </AsyncGate>
  );
};

const DocumentRevisionControlContainerWithStyles = withStyles(styles)(
  DocumentRevisionControlContainer,
);

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadDocumentRevisionsAction: documentRevisionsActions.loadList,
  },
)(DocumentRevisionControlContainerWithStyles);
