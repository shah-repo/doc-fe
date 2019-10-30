import _ from "lodash";
import React, { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  DocumentRevision,
  DocumentRevisionsByIdState,
  documentRevisionsSelectors,
  DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions";
import { tableSearchActions, tableSearchSelectors } from "../../../state/ducks/tableSearch";
import { ApplicationState } from "../../../state/reducers";
import AddDocumentRevisionContainer from "./AddDocumentRevision.container";
import DocumentRevisionControlPresenter from "./DocumentRevisionControl.presenter";
import styles from "./DocumentRevisionControl.styles";

interface StateProps {
  documentRevisionsList: DocumentRevision[];
  documentRevisionsById: DocumentRevisionsByIdState;
}

interface OwnProps {
  doneAddingDocuments: (addedDocuments: string[]) => void;
  documentsInChangeRequest: string[];
  deleteDocumentFromChangeRequest: (documentRevisionId: string) => void;
  selectDocumentRevision: (documentRevisionId: string) => void;
  selectAssessmentForm: () => void;
  selectedDocumentRevision: string | null;
  documentsInCrById: { [key: string]: DocumentRevision };
}

export type DocumentRevisionControlContainerProps = OwnProps &
  StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
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
  documentRevisionsList,
  deleteDocumentFromChangeRequest,
  selectDocumentRevision,
  selectAssessmentForm,
  documentRevisionsById,
  selectedDocumentRevision,
  documentsInCrById,
}) => {
  const classes = styles();
  const [showAddDocuments, setShowAddDocuments] = useState(false);

  const openAddDocuments = () => setShowAddDocuments(true);
  const closeAddDocuments = () => setShowAddDocuments(false);

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
      <DocumentRevisionControlPresenter
        documentsInChangeRequest={documentsInChangeRequest}
        documentsInCrById={documentsInCrById}
        documentRevisionsById={documentRevisionsById}
        deleteDocumentFromChangeRequest={deleteDocumentFromChangeRequest}
        selectDocumentRevision={selectDocumentRevision}
        selectedDocumentRevision={selectedDocumentRevision}
        selectAssessmentForm={selectAssessmentForm}
        openAddDocuments={openAddDocuments}
      />
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

export default connect<StateProps, null, OwnProps, ApplicationState>(mapStateToProps)(DocumentRevisionControlContainer);
