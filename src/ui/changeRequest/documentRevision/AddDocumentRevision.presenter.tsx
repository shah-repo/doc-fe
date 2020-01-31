import { AppBar, Dialog, Toolbar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { DocumentRevision, DocumentRevisionsByIdState } from "../../../state/ducks/documentRevisions";
import { TablePanelStateProps, TableDataProps } from "../../components/table/types";
import Text from "../../components/Text";
import styles from "./AddDocumentRevision.styles";
import DocumentRevisionTable from "./DocumentRevisionTable.presenter";

interface AddDocumentRevisionPresenterProps {
  isOpen: boolean;
  documentRevisionsById: DocumentRevisionsByIdState;
  addedDocuments: string[];
  documentRevisionsToShow: DocumentRevision[];
  tableName: string;
  tableCriteria: TablePanelStateProps;
  tableData: TableDataProps<DocumentRevision>;
  close: () => void;
  closeDialogAddDocuments: () => void;
  addDocument: (documentRevisionId: string) => void;
  handleDelete: (documentRevisionId: string) => () => void;
}

export const AddDocumentRevisionPresenter: React.FunctionComponent<AddDocumentRevisionPresenterProps> = ({
  isOpen,
  close,
  closeDialogAddDocuments,
  documentRevisionsById,
  addDocument,
  addedDocuments,
  handleDelete,
  documentRevisionsToShow,
  tableName,
  tableCriteria,
  tableData,
}) => {
  const classes = styles();

  const renderSlectedDocuments = () => (
    addedDocuments.map((documentRevisionId) => (
      <Chip
        className={classes.documentRevision}
        key={documentRevisionId}
        label={(documentRevisionsById[documentRevisionId] || {}).name}
        onDelete={handleDelete(documentRevisionId)}
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
          tableCriteria={tableCriteria}
          tableData={tableData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default (AddDocumentRevisionPresenter);
