import { List } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Nullable } from "../../state/ducks/common";
import { DocumentRevision, documentRevisionsActions } from "../../state/ducks/documentRevisions";
import { styles } from "./DocumentRevisionList.container.styles";
import DocumentRevisionListPresenter from "./DocumentRevisionList.presenter";

interface OwnProps {
  documentRevisions: DocumentRevision[];
  documentId: string;
  docId: string;
  selectedDocumentRevision: Nullable<string>;
  documentRevisionId: Nullable<string>;
}

export type DocumentRevisionListContainerProps = OwnProps;

// used by the document revision manager container
export const DocumentRevisionListContainer: React.FunctionComponent<
DocumentRevisionListContainerProps
> = ({
  documentRevisions,
  documentId,
  docId,
  selectedDocumentRevision,
  documentRevisionId,
}) => {
  const classes = styles();
  const dispatch = useDispatch();
  const loadDocumentAction = useCallback(() => {
    dispatch(documentRevisionsActions.loadDocument(documentId));
  }, [dispatch, documentId]);

  useEffect(() => {
    loadDocumentAction();
  }, [loadDocumentAction, documentId]);

  return (
    <div className={classes.container}>
      <List>
        {
          documentRevisions.map((documentRevision) => (
            <DocumentRevisionListPresenter
              key={documentRevision.id}
              {...{ documentRevision, docId, documentId, selectedDocumentRevision }}
            />
          )
          )
        }
      </List>
    </div>
  );
};

export default DocumentRevisionListContainer;
