import _ from "lodash";
import React, { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { DocumentRevision, DocumentRevisionsByIdState, documentRevisionsSelectors, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { ApplicationState } from "../../../state/reducers";
import AddDocumentRevisionContainer from "./AddDocumentRevision.container";
import DocumentRevisionControlPresenter from "./DocumentRevisionControl.presenter";
import styles from "./DocumentRevisionControl.styles";

interface StateProps {
  documentRevisionsList: DocumentRevision[];
  documentRevisionsById: DocumentRevisionsByIdState;
}

interface OwnProps {
  documentsInChangeRequest: string[];
  selectedDocumentRevision: string | null;
  documentsInCrById: { [key: string]: DocumentRevision };
  selectDocumentRevision: (documentRevisionId: string) => void;
  selectAssessmentForm: () => void;
  setDocumentRevisionsList: (documents: string[]) => void;
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
  setDocumentRevisionsList,
  documentsInChangeRequest,
  documentRevisionsList,
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
  const deleteDocumentFromChangeRequest = (
    deleteDocumentRevisionId: string,
  ) => {
    setDocumentRevisionsList(
      documentsInChangeRequest.filter(
        (documentRevisionId) => documentRevisionId !== deleteDocumentRevisionId,
      ),
    );
  };

  const TABLE_NAME = "addDocRevTable";
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const tableData = useSelector(getTableData(TABLE_NAME));
  const dispatch = useDispatch();
  if (_.isEmpty(tableCriteria.queryDict)) {
    dispatch(tableSearchActions.setSearchCriteria(
      {
        ...tableCriteria,
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
        setDocumentRevisionsList={setDocumentRevisionsList}
        documentsInChangeRequest={documentsInChangeRequest}
        documentRevisionsList={documentRevisionsList}
        documentRevisionsById={documentRevisionsById}
        tableName={TABLE_NAME}
        tableCriteria={tableCriteria}
        tableData={tableData}
      />
    </div>
  );
};

export default connect<StateProps, null, OwnProps, ApplicationState>(mapStateToProps)(DocumentRevisionControlContainer);
