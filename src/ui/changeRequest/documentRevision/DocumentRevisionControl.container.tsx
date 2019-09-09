import Button from "@material-ui/core/Button";
import React, { useState } from "react";

import { Fab, Icon, withStyles, WithStyles } from "@material-ui/core";
import { AddCircleRounded } from "@material-ui/icons";
import { connect } from "react-redux";
import {
  DocumentRevision,
  documentRevisionsActions,
  DocumentRevisionsByIdState,
  documentRevisionsSelectors,
} from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import Text from "../../components/Text";
import AddDocumentRevisionContainer from "./AddDocumentRevision.container";
import styles from "./DocumentRevisionControl.styles";
import DocumentRevisionItemPresenter from "./DocumentRevisionItem.presenter";

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
    documentsInChangeRequest.map((documentRevisionId) => (
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
        <Fab
          color="primary"
          variant="extended"
          size="large"
          onClick={selectAssessmentForm}
        >
          <Text translation="changeRequest.documentControl.changeRequestForm" />
        </Fab>
        <div className={classes.documentRevisionContainer}>
          {renderDocumentRevisions()}
        </div>
        <Button
          variant="text"
          color="primary"
          onClick={openAddDocuments}
          fullWidth={true}
          className={classes.addDocument}>
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
