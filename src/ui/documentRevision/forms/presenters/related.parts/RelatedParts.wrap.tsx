/* eslint-disable no-console */
import { Link, Typography } from "@material-ui/core";
import { get } from "lodash";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import { relatedPartsActions } from "../../../../../state/ducks/relatedParts";
import { RelatedPartsListItem, RELATED_STATUS } from "../../../../../state/ducks/relatedParts/types";
import { toastSuccess } from "../../../../components/notifications";
import { documentPreviewPath } from "../../../../document.revision/utils/paths";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import { styles } from "./RelatedPart.styles";
import RelatedParts from "./RelatedParts";

interface Props {
  documentRevision: DocumentRevision;
  parentPartStatus: RELATED_STATUS | undefined;
}


interface RelatedPartsProps {
  documentRevision: DocumentRevision;
  parentStatus: RELATED_STATUS | undefined;
  parentStatusChanged;
  createNewDocument: (relatedPartDetails: any) => void;
  newRelatedPart;
  viewRelatedPart;
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
  const classes = styles();
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

  const [parentStatus, setParentStatus] = useState(parentPartStatus);

  const [newRelatedPart, setNewRelatedPart] = useState<RelatedPartsListItem>();

  const createRelatedPartAction = useActionCreator(relatedPartsActions.createRelatedPart);

  const createPartAsync = useAsync({
    onSuccess: (createdDocumentRevision?) => {
      if (createdDocumentRevision) {
        console.log(createdDocumentRevision);
        if (parentStatus === RELATED_STATUS.PARENT_SEPARATE) {
          // Show a toast
          showSuccessToast(createdDocumentRevision as DocumentRevision, viewRelatedPart);

        } else if (parentStatus === RELATED_STATUS.PARENT_TOGETHER) {
          // populate the list with the new added part
          setNewRelatedPart({
            documentId: get(createdDocumentRevision, "documentId"),
            rootDocId: get(createdDocumentRevision, "document.docId"),
            name: get(createdDocumentRevision, "name"),
            documentRevisionId: get(createdDocumentRevision, "id"),
            status: get(createdDocumentRevision, "displayStatus"),
          });

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
      // console.log(data);
      if (data) {
        setParentStatus(data.relatedStatus);
        dispatch(documentRevisionsActions.reload(documentRevision.id));
      }
    },
  });


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

    if (parentStatus === RELATED_STATUS.PARENT_TOGETHER) {
      docDto = {
        ...docDto,
        name: `${documentRevision.name}-${relatedPartDetails?.name}`,
        suffixName: relatedPartDetails?.name,
        document: { ...docDto.document, docId: `${documentRevision.document.docId}-${relatedPartDetails?.docId}` },
      };
    }

    // console.log(documentRevision, docDto);
    createPartAsync.start(createRelatedPartAction, documentRevision.document.id, docDto, createPartAsync);
  };


  const parentStatusChanged = (value) => {
    // setParentStatus(value);

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


  return (
    <RelatedParts documentRevision={documentRevision}
      parentStatus = {parentStatus}
      parentStatusChanged = {parentStatusChanged}
      createNewDocument = {createNewDocument}
      newRelatedPart = {newRelatedPart}
      viewRelatedPart = {viewRelatedPart} />
  );
};


export default RelatedPartsContainer;
