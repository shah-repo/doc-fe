import React, { useEffect, useState } from "react";
import { DocumentRevision, DocumentRevisionsByIdState, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import { AddDocumentRevisionPresenter } from "./AddDocumentRevision.presenter";

interface AddDocumentRevisionContainerProps {
  isOpen: boolean;
  close: () => void;
  setDocumentRevisionsList: (documents: string[]) => void;
  documentsInChangeRequest: string[];
  documentRevisionsList: DocumentRevision[];
  documentRevisionsById: DocumentRevisionsByIdState;
  tableName: string;
  tableCriteria: TablePanelStateProps;
  tableData: TableDataProps<DocumentRevision>;
}

export const AddDocumentRevisionContainer: React.FunctionComponent<AddDocumentRevisionContainerProps> = ({
  isOpen,
  close,
  setDocumentRevisionsList,
  documentsInChangeRequest,
  documentRevisionsById,
  tableName,
  tableCriteria,
  tableData,
}) => {
  const [documentRevisionsToShow, setDocumentRevisionsToShow] = useState<
  DocumentRevision[]
  >([]);
  const [addedDocuments, setAddedDocuments] = useState<string[]>([]);
  const addDocument = (documentRevisionId: string) =>
    setAddedDocuments(Array.from(
      new Set([...addedDocuments, documentRevisionId]),
    ));
  const deleteDocument = (documentRevisionId: string) =>
    setAddedDocuments(addedDocuments.filter((id) => id !== documentRevisionId));

  useEffect(() => {
    const documentsToIgnore = [...addedDocuments, ...documentsInChangeRequest].map((documentRevisionId) =>
      documentRevisionId);
    const filteredArray = tableData.filter((documentRevision) =>
      !documentsToIgnore.includes(documentRevision.id) && documentRevision.status === DocumentRevisionStatus.Draft);
    setDocumentRevisionsToShow(filteredArray);
  }, [addedDocuments, documentsInChangeRequest, tableData]);

  const closeDialogAddDocuments = () => {
    const documentRevisions = new Set([
      ...addedDocuments,
      ...documentsInChangeRequest,
    ]);
    setDocumentRevisionsList(Array.from(documentRevisions));
    setAddedDocuments([]);
    close();
  };
  const handleDelete = (documentRevisionId: string) => () => deleteDocument(documentRevisionId);

  return (
    <AddDocumentRevisionPresenter
      isOpen={isOpen}
      close={close}
      closeDialogAddDocuments={closeDialogAddDocuments}
      documentRevisionsById={documentRevisionsById}
      addDocument={addDocument}
      addedDocuments={addedDocuments}
      handleDelete={handleDelete}
      documentRevisionsToShow={documentRevisionsToShow}
      tableName={tableName}
      tableCriteria={tableCriteria}
      tableData={tableData}
    />
  );
};

export default AddDocumentRevisionContainer;
