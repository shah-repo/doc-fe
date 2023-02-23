import { Link, Typography } from "@material-ui/core";
import { useFormikContext } from "formik";
import { get } from "lodash";
import { useObserver } from "mobx-react";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import { relatedPartsActions } from "../../../../../state/ducks/relatedParts";
import { RelatedPartsListItem, RELATED_PARTS_STATUS } from "../../../../../state/ducks/relatedParts/types";
import { toastSuccess } from "../../../../components/notifications";
import Text from "../../../../components/Text";
import { documentPreviewPath } from "../../../../document.revision/utils/paths";
import { FB } from "../../../../form.builder";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import useStyles from "./RelatedPart.styles";
import RelatedParts from "./RelatedParts";
import RelatedPartsState from "./RelatedParts.state";

interface Props {
  viewOnly: boolean;
  documentRevision: DocumentRevision;
  relatedPartsStatus?: RELATED_PARTS_STATUS;
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

  const viewFromModal = () => viewRelatedPart(documentRevisionId, documentId);

  return (
    <>
      <Typography variant="body1">
        <Text translation="relatedParts.created.modal.success.msg"/>
      </Typography>
      <div className={classes.successMessage}>
        <Typography variant="subtitle1">
          <Text translation="relatedParts.created.modal.msg.part.before"/> <b>{docId}</b> &nbsp;
          <Text translation="relatedParts.created.modal.msg.part.after"/>
        </Typography>
        <Link onClick={viewFromModal}
          tabIndex={0} className={classes.normalFontWeight}
          variant="subtitle1" color="textSecondary">
          <Text translation="relatedParts.created.modal.view"/>
        </Link>
      </div>
    </>
  );
};

const RelatedPartsContainer: React.FunctionComponent<Props> = ({
  documentRevision,
  relatedPartsStatus,
  viewOnly,
}) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const { workspaceState } = FB.useStores();
  const formik = useFormikContext();

  const relatedPartsState = FB.useRef<RelatedPartsState>(RelatedPartsState);
  relatedPartsState.setViewOnlyMode(viewOnly);

  const [parentPartStatus, setParentPartStatus] = useState(relatedPartsStatus);

  const createRelatedPartAction = useActionCreator(relatedPartsActions.createRelatedPart);

  const createPartAsync = useAsync({
    onSuccess: ({ createdDocumentRevision, suffixName }: any) => {
      if (!createdDocumentRevision) {
        return;
      }

      if (parentPartStatus === RELATED_PARTS_STATUS.PARENT_SEPARATE) {
        // Show a toast
        showSuccessToast(createdDocumentRevision as DocumentRevision, viewRelatedPart);

      } else if (parentPartStatus === RELATED_PARTS_STATUS.PARENT_TOGETHER) {
        // populate the list with the new added part
        relatedPartsState.addNewRelatedPart(createdDocumentRevision, suffixName);
        formik.submitForm();
        workspaceState?.saveDocRev();
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
        setParentPartStatus(data.relatedStatus);
        dispatch(documentRevisionsActions.reload(documentRevision.id));
      }
    },
  });


  const fetchAllRelatedPartsAction = useActionCreator(relatedPartsActions.fetchAllRelatedParts);
  const fetchRelatedPartsAsync = useAsync({
    onSuccess: (relatedPartsList) => {
      relatedPartsState.setRelatedPartsList(relatedPartsList as RelatedPartsListItem[]);
    },
  });

  const fetchRelatedParts = useCallback((documentRevisionId) => {
    fetchRelatedPartsAsync.start(fetchAllRelatedPartsAction, documentRevisionId, fetchRelatedPartsAsync);
  }, [fetchAllRelatedPartsAction, fetchRelatedPartsAsync]);

  const voidRelatedPartAction = useActionCreator(relatedPartsActions.voidRelatedPart);
  const voidRelatedPartAsync = useAsync({
    onSuccess: ({ docRevId, name }: any) => {
      relatedPartsState.updateRelatedPartsList(docRevId, name);
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
          securityEmployees: (get(documentRevision, "document.securityEmployees", []))
            .map((employee) => ({ id: employee.value })),
          securityGroups: (get(documentRevision, "document.securityGroups", []))
            .map((group) => ({ id: group.id })),
          operators: get(documentRevision, "document.operators"),
        },
        documentType: {
          id: get(documentRevision, "document.documentType.id"),
        },
      },
    };

    if (parentPartStatus === RELATED_PARTS_STATUS.PARENT_TOGETHER) {
      docDto = Object.assign(docDto, {
        revision: documentRevision.revision,
        changeRequestId: documentRevision.changeRequest?.id ?? null,
        status: documentRevision.status,
        name: `${documentRevision.name}-${relatedPartDetails?.name}`,
        suffixName: relatedPartDetails?.name,
        document: { ...docDto.document, docId: `${documentRevision.document.docId}-${relatedPartDetails?.docId}` },
      });
    }

    createPartAsync.start(createRelatedPartAction, documentRevision.document.id, documentRevision.id, docDto,
      relatedPartDetails?.name, createPartAsync);
  };


  const parentPartStatusChanged = (value) => {
    // Make an API call to persist the parent row.
    if (value && documentRevision.documentId) {
      parentChoiceAsync.start(createParentPartChoiceAction, {
        documentId: documentRevision.documentId,
        documentRevisionId: documentRevision.id,
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
      parentStatus = {parentPartStatus}
      parentStatusChanged = {parentPartStatusChanged}
      createNewDocument = {createNewDocument}
      viewRelatedPart = {viewRelatedPart}
      fetchRelatedParts = {fetchRelatedParts}
      voidRelatedPart = {voidRelatedPart}
      relatedPartsState = {relatedPartsState}
    />
  ));
};


const RelatedPartsWrapper: React.FunctionComponent<Props> = ({
  documentRevision,
  relatedPartsStatus,
  viewOnly,
}) => (
  <RelatedPartsContainer
    viewOnly = {viewOnly}
    documentRevision={documentRevision}
    relatedPartsStatus = {relatedPartsStatus}
  />
);


export default RelatedPartsWrapper;
