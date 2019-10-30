import { Fab, Icon, withStyles, WithStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { AddCircleRounded } from "@material-ui/icons";
import _ from "lodash";
import React, { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  DocumentRevision,
  documentRevisionsActions,
  DocumentRevisionsByIdState,
  documentRevisionsSelectors,
  DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions";
import { tableSearchActions, tableSearchSelectors } from "../../../state/ducks/tableSearch";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
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
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
}

interface OwnProps {
  doneAddingDocuments: (addedDocuments: string[]) => void;
  documentsInChangeRequest: string[];
  deleteDocumentFromChangeRequest: (documentRevisionId: string) => void;
  selectDocumentRevision: (documentRevisionId: string) => void;
  selectAssessmentForm: () => void;
  selectedDocumentRevision: string | null;
  documentsInCrById: any;
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
  loadDocumentRevisions,
  documentRevisionsList,
  deleteDocumentFromChangeRequest,
  selectDocumentRevision,
  selectAssessmentForm,
  classes,
  documentRevisionsById,
  selectedDocumentRevision,
  documentsInCrById,
}) => {
  const [showAddDocuments, setShowAddDocuments] = useState(false);

  const openAddDocuments = () => setShowAddDocuments(true);
  const closeAddDocuments = () => setShowAddDocuments(false);

  const renderDocumentRevisions = () =>
    documentsInChangeRequest.map((documentRevisionId) => (
      <DocumentRevisionItemPresenter
        key={documentRevisionId}
        documentRevision={documentsInCrById[documentRevisionId] || documentRevisionsById[documentRevisionId]}
        onDelete={() => deleteDocumentFromChangeRequest(documentRevisionId)}
        onClick={() => selectDocumentRevision(documentRevisionId)}
        selectedDocumentRevision={selectedDocumentRevision!}
      />
    ));

  const TABLE_NAME = "addDocRevTable";
  const tableState = useSelector((reduxState: ApplicationState) =>
    tableSearchSelectors.getTableState(reduxState, TABLE_NAME),
  );
  const dispatch = useDispatch();
  if (_.isEmpty(tableState.queryDict)) {
    dispatch(tableSearchActions.setSearchCriteria(
      {
        ...tableState,
        queryDict: {
          "status[]": DocumentRevisionStatus.Draft,
        },
      },
      TABLE_NAME,
    ));
  }

  return (
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
        tableName={TABLE_NAME}
        tableState={tableState}
      />
    </div>
  );
};

const DocumentRevisionControlContainerWithStyles = withStyles(styles)(
  DocumentRevisionControlContainer,
);

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadDocumentRevisions: documentRevisionsActions.loadList,
  },
)(DocumentRevisionControlContainerWithStyles);
