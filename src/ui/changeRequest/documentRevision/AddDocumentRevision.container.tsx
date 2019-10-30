import { AppBar, Dialog, Toolbar } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React, { useEffect, useState } from "react";
import {
  DocumentRevision,
  DocumentRevisionsByIdState,
  DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions";
import { TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import styles from "./AddDocumentRevision.styles";
import DocumentRevisionTable from "./DocumentRevisionTable.presenter";

interface AddDocumentRevisionContainerProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  close: () => void;
  doneAddingDocuments: (addedDocuments: string[]) => void;
  documentsInChangeRequest: string[];
  documentRevisionsList: DocumentRevision[];
  documentRevisionsById: DocumentRevisionsByIdState;
  tableName: string;
  tableState: TablePanelStateProps<DocumentRevision>;
}

export const AddDocumentRevisionContainer: React.FunctionComponent<AddDocumentRevisionContainerProps> = ({
  isOpen,
  close,
  documentRevisionsList,
  classes,
  doneAddingDocuments,
  documentsInChangeRequest,
  documentRevisionsById,
  tableName,
  tableState,
}) => {
  const [documentRevisionsToShow, setDocumentRevisionsToShow] = useState<DocumentRevision[]>([]);
  const [addedDocuments, setAddedDocuments] = useState<string[]>([]);
  const addDocument = (documentRevisionId: string) => setAddedDocuments([...addedDocuments, documentRevisionId]);
  const deleteDocument = (documentRevisionId: string) =>
    setAddedDocuments(addedDocuments.filter((id) => id !== documentRevisionId));

  useEffect(() => {
    const documentsToIgnore = [...addedDocuments, ...documentsInChangeRequest].map((documentRevisionId) =>
      documentRevisionId);
    const filteredArray = documentRevisionsList.filter((documentRevision) =>
      documentsToIgnore.indexOf(documentRevision.id) < 0 && documentRevision.status === DocumentRevisionStatus.Draft);
    setDocumentRevisionsToShow(filteredArray);
  }, [addedDocuments, documentsInChangeRequest, documentRevisionsList]);

  const closeDialogAddDocuments = () => {
    doneAddingDocuments([...addedDocuments]);
    setAddedDocuments([]);
    close();
  };

  const renderSlectedDocuments = () => (
    addedDocuments.map((documentRevisionId) => (
      <Chip
        className={classes.documentRevision}
        key={documentRevisionId}
        label={(documentRevisionsById[documentRevisionId] || {}).name}
        onDelete={() => deleteDocument(documentRevisionId)}
      />
    ))
  );

  return (
    <Dialog fullScreen={true} open={isOpen}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton color="primary" onClick={close} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.dialogContent}>
        <Button
          variant="contained"
          color="primary"
          onClick={closeDialogAddDocuments}
          className={classes.doneButton}
        >
          <Text translation="changeRequest.documentControl.done" />
        </Button>
        <div className={classes.documentRevisionContainer}>
          {renderSlectedDocuments()}
        </div>
        <DocumentRevisionTable
          documentRevisionsToShow={documentRevisionsToShow}
          addDocument={addDocument}
          addedDocuments={addedDocuments}
          tableName={tableName}
          tableState={tableState}
        />
      </DialogContent>
    </Dialog>
  );
};

export default withStyles(styles)(AddDocumentRevisionContainer);
