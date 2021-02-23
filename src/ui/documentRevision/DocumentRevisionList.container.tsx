import { List } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Nullable } from "../../state/ducks/common";
import { DocumentRevision, documentRevisionsActions } from "../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../state/ducks/documentRevisions/documentType";
import { styles } from "./DocumentRevisionList.container.styles";
import DocumentRevisionListPresenter from "./DocumentRevisionList.presenter";
import { checkIsDocumentPO } from "./helpers/checkDocumentGroup";

interface OwnProps {
  documentRevisions: DocumentRevision[];
  documentId: string;
  docId: string;
  selectedDocumentRevision: Nullable<string>;
  documentRevisionId: Nullable<string>;
  documentTypeId?: string;
  isInlineApproval: boolean;
  isRecord: boolean;
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
  documentTypeId,
  isInlineApproval,
  isRecord,
}) => {
  const classes = styles();
  const dispatch = useDispatch();
  const loadDocumentAction = useCallback(() => {
    dispatch(documentRevisionsActions.loadDocument(documentId));
  }, [dispatch, documentId]);

  useEffect(() => {
    loadDocumentAction();
  }, [loadDocumentAction, documentId]);

  const documentTypeGroupOptions = useSelector(documentTypeSelectors.byId)[documentTypeId || ""]?.groupOptions;
  const isDocumentPO = checkIsDocumentPO(documentTypeGroupOptions);

  return (
    <div className={classes.container}>
      <List>
        {
          documentRevisions.map((documentRevision) => (
            <DocumentRevisionListPresenter
              key={documentRevision.id}
              {...{
                documentRevision,
                docId,
                isInlineApproval,
                documentId,
                selectedDocumentRevision,
                documentTypeId,
                isDocumentPO,
                isRecord,
              }}
            />
          )
          )
        }
      </List>
    </div>
  );
};

export default DocumentRevisionListContainer;
