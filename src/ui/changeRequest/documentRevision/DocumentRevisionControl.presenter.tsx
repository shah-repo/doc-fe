import { Fab, Icon } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { AddCircleRounded } from "@material-ui/icons";
import _ from "lodash";
import React from "react";
import { DocumentRevision, DocumentRevisionsByIdState } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import styles from "./DocumentRevisionControl.styles";
import DocumentRevisionItemPresenter from "./DocumentRevisionItem.presenter";

interface OwnProps {
  documentsInChangeRequest: string[];
  documentsInCrById: { [key: string]: DocumentRevision };
  documentRevisionsById: DocumentRevisionsByIdState;
  selectedDocumentRevision: string | null;
  selectDocumentRevision: (documentRevisionId: string) => void;
  deleteDocumentFromChangeRequest: (documentRevisionId: string) => void;
  selectAssessmentForm: () => void;
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
  selectDocumentRevision,
  selectedDocumentRevision,
  selectAssessmentForm,
  openAddDocuments,
}) => {
  const classes = styles();
  const renderDocumentRevisions = () =>
    documentsInChangeRequest.map((documentRevisionId: string) => (
      <DocumentRevisionItemPresenter
        key={documentRevisionId}
        documentRevision={documentsInCrById[documentRevisionId] || documentRevisionsById[documentRevisionId]}
        onDelete={() => deleteDocumentFromChangeRequest(documentRevisionId)}
        onClick={() => selectDocumentRevision(documentRevisionId)}
        selectedDocumentRevision={selectedDocumentRevision!}
      />
    ));

  return (
    <>
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
    </>
  );
};

export default DocumentRevisionControlPresenter;
