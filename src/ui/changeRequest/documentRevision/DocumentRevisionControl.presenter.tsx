import { Fab, Icon } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { AddCircleRounded } from "@material-ui/icons";
import React from "react";
import { DocumentRevision, DocumentRevisionsByIdState } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import { documentVersionPath } from "../../document.revision/utils/paths";
import styles from "./DocumentRevisionControl.styles";
import DocumentRevisionItemPresenter from "./DocumentRevisionItem.presenter";

interface OwnProps {
  documentsInChangeRequest: string[];
  documentsInCrById: { [key: string]: DocumentRevision };
  documentRevisionsById: DocumentRevisionsByIdState;
  deleteDocumentFromChangeRequest: (documentRevisionId: string) => void;
  openAddDocuments: () => void;
}

export type DocumentRevisionControlPresenterProps = OwnProps;

export const DocumentRevisionControlPresenter: React.FunctionComponent<
DocumentRevisionControlPresenterProps
> = ({
  documentsInChangeRequest,
  documentsInCrById,
  documentRevisionsById,
  deleteDocumentFromChangeRequest,
  openAddDocuments,
}) => {
  const classes = styles();
  const handleDelete = (documentRevisionId: string) => () =>
    deleteDocumentFromChangeRequest(documentRevisionId);
  const handleClick = (documentRevisionId: string) => () => {
    const documentRevision = documentsInCrById[documentRevisionId] || documentRevisionsById[documentRevisionId];
    window.open(documentVersionPath(documentRevision.id, documentRevision.document.id), "_blank");
  };
  const renderDocumentRevisions = () =>
    documentsInChangeRequest.map((documentRevisionId: string) => (
      <DocumentRevisionItemPresenter
        key={documentRevisionId}
        documentRevision={
          documentsInCrById[documentRevisionId] ||
            documentRevisionsById[documentRevisionId]
        }
        onDelete={handleDelete(documentRevisionId)}
        onClick={handleClick(documentRevisionId)}
      />
    ));

  return (
    <>
      <Fab
        color="primary"
        variant="extended"
        size="large"
        id="ChangeRequest-form"
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
        className={classes.addDocument}
        id="ChangeRequest-addDocuments"
      >
        <Icon className={classes.leftIcon}>
          <AddCircleRounded />
        </Icon>
        <Text translation="changeRequest.documentControl.addDocuments" />
      </Button>
    </>
  );
};

export default DocumentRevisionControlPresenter;
