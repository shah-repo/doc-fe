import { Link, Typography } from "@material-ui/core";
import { get } from "lodash";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import { relatedPartsActions } from "../../../../../state/ducks/relatedParts";
import { RelatedPartsListItem, RELATED_PARTS_STATUS } from "../../../../../state/ducks/relatedParts/types";
import { toastSuccess } from "../../../../components/notifications";
import { documentPreviewPath } from "../../../../document.revision/utils/paths";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import useStyles from "./RelatedPart.styles";
import RelatedParts from "./RelatedParts";
import { relatedPartsStore, RelatedPartsStoreContext, useRelatedPartsStore } from "./RelatedParts.state";

interface Props {
  documentRevision: DocumentRevision;
  parentPartStatus: RELATED_PARTS_STATUS | undefined;
}

const SuccessMsg: React.FunctionComponent<{
  docId: string;
  documentRevisionId: string;
  documentId: string;
  viewRelatedPart: (docRevId: string, documentId: string) => void;
}> = ({
  docId,
  documentRevisionId,
  documentId,
  viewRelatedPart,
}) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="body1">
          Related Part created successfully
      </Typography>
      <div className={classes.successMessage}>
        <Typography variant="subtitle1">
            Part <b>{docId}</b> has been created
        </Typography>
        <Link onClick={(event) => viewRelatedPart(documentRevisionId, documentId)}
          tabIndex={0} style={{ fontWeight: "normal" }}
          variant="subtitle1" color="textSecondary">
              View
        </Link>
      </div>
    </>
  );
};

const RelatedPartsContainer: React.FunctionComponent<Props> = ({
  documentRevision,
  parentPartStatus,
}) => {

  const dispatch = useDispatch();
  const history = useHistory();

  const { relatedPartsStore } = useRelatedPartsStore();

  const [parentStatus, setParentStatus] = useState(parentPartStatus);

  const createRelatedPartAction = useActionCreator(relatedPartsActions.createRelatedPart);

  const createPartAsync = useAsync({
    onSuccess: ({ createdDocumentRevision, suffixName }: any) => {
      if (createdDocumentRevision) {
        if (parentStatus === RELATED_PARTS_STATUS.PARENT_SEPARATE) {
          // Show a toast
          showSuccessToast(createdDocumentRevision as DocumentRevision, viewRelatedPart);

        } else if (parentStatus === RELATED_PARTS_STATUS.PARENT_TOGETHER) {
          // populate the list with the new added part
          relatedPartsStore.addNewRelatedPart(createdDocumentRevision, suffixName);
        }
      }
    },
  });

  const showSuccessToast = (
    docRevision: DocumentRevision,
    viewRelatedPart: (docRevId: string, documentId: string) => void) => {

    if (docRevision && docRevision.document) {
      toastSuccess(<SuccessMsg docId={docRevision.document.docId}
        viewRelatedPart={viewRelatedPart} documentRevisionId={docRevision.id}
        documentId={docRevision.document.id}/>, {
        closeButton: false,
      });
    }
  };


  const createParentPartChoiceAction = useActionCreator(relatedPartsActions.parentPartChoiceAction);
  const parentChoiceAsync = useAsync<any>({
    onSuccess: (data) => {
      if (data) {
        setParentStatus(data.relatedStatus);
        dispatch(documentRevisionsActions.reload(documentRevision.id));
      }
    },
  });


  const fetchAllRelatedPartsAction = useActionCreator(relatedPartsActions.fetchAllRelatedParts);
  const fetchRelatedPartsAsync = useAsync({
    onSuccess: (relatedPartsList) => {
      relatedPartsStore.setRelatedPartsList(relatedPartsList as RelatedPartsListItem[]);
    },
  });

  const fetchRelatedParts = (documentId) => {
    fetchRelatedPartsAsync.start(fetchAllRelatedPartsAction, documentId, fetchRelatedPartsAsync);
  };

  const voidRelatedPartAction = useActionCreator(relatedPartsActions.voidRelatedPart);
  const voidRelatedPartAsync = useAsync({
    onSuccess: ({ docRevId, name }: any) => {
      relatedPartsStore.updateRelatedPartsList(docRevId, name);
    },
  });

  const voidRelatedPart = (listItem: RelatedPartsListItem) => {
    voidRelatedPartAsync.start(voidRelatedPartAction, listItem.documentRevisionId, voidRelatedPartAsync);
  };


  const createNewDocument = (relatedPartDetails?) => {
    let docDto = {
      formDocument: {
        id: get(documentRevision, "formDocumentId"),
      },
      description: "",
      name: "",
      suffixName: "",
      attachments: [],
      referenceTo: [],
      revisionChangeType: get(documentRevision, "revisionChangeType"),
      document: {
        docId: "",
        securityList: {
          securityEmployees: (get(documentRevision, "document.securityEmployees") || [])
            .map((employee) => ({ id: employee.value })),
          securityGroups: (get(documentRevision, "document.securityGroups") || [])
            .map((group) => ({ id: group.id })),
          operators: get(documentRevision, "document.operators"),
        },
        documentType: {
          id: get(documentRevision, "document.documentType.id"),
        },
      },
    };

    if (parentStatus === RELATED_PARTS_STATUS.PARENT_TOGETHER) {
      docDto = {
        ...docDto,
        name: `${documentRevision.name}-${relatedPartDetails?.name}`,
        suffixName: relatedPartDetails?.name,
        document: { ...docDto.document, docId: `${documentRevision.document.docId}-${relatedPartDetails?.docId}` },
      };
    }

    createPartAsync.start(createRelatedPartAction, documentRevision.document.id, docDto,
      relatedPartDetails?.name, createPartAsync);
  };


  const parentStatusChanged = (value) => {
    // Make an API call to persist the parent row.
    if (value) {
      parentChoiceAsync.start(createParentPartChoiceAction, {
        documentId: documentRevision.documentId,
        rootDocId: documentRevision.document?.docId,
        relatedStatus: value,
      }, parentChoiceAsync);
    }
  };


  const viewRelatedPart = (docRevId: string, documentId: string) => {
    const urlPath = documentPreviewPath(docRevId, documentId);
    history.push(urlPath);
  };


  return useObserver(() => (
    <RelatedParts documentRevision={documentRevision}
      parentStatus = {parentStatus}
      parentStatusChanged = {parentStatusChanged}
      createNewDocument = {createNewDocument}
      viewRelatedPart = {viewRelatedPart}
      fetchRelatedParts = {fetchRelatedParts}
      voidRelatedPart = {voidRelatedPart}
    />
  ));
};


const RelatedPartsWrapper: React.FunctionComponent<Props> = ({
  documentRevision,
  parentPartStatus,
}) => (
  <RelatedPartsStoreContext.Provider value={relatedPartsStore}>
    <RelatedPartsContainer
      documentRevision={documentRevision}
      parentPartStatus = {parentPartStatus}
    />
  </RelatedPartsStoreContext.Provider>
);


export default RelatedPartsWrapper;
