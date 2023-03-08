import { Link, Typography } from "@material-ui/core";
import { useFormikContext } from "formik";
import { get } from "lodash";
import { useObserver } from "mobx-react";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { DocumentRevision, RevisionChangeType } from "../../../../../state/ducks/documentRevisions/types";
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
  const [isSubPartBeingAdded, setSubPartBeingAdded] = useState(false);

  const createRelatedPartAction = useActionCreator(relatedPartsActions.createRelatedPart);

  const createPartAsync = useAsync({
    onSuccess: ({ createdRelatedPart }: any) => {
      setSubPartBeingAdded(false);
      if (!createdRelatedPart) {
        return;
      }

      if (parentPartStatus === RELATED_PARTS_STATUS.PARENT_SEPARATE) {
        // Show a toast
        showSuccessToast(createdRelatedPart as RelatedPartsListItem, viewRelatedPart);

      } else if (parentPartStatus === RELATED_PARTS_STATUS.PARENT_TOGETHER) {
        // populate the list with the new added part
        relatedPartsState.addNewRelatedPart(createdRelatedPart);
        formik.submitForm();
        workspaceState?.saveDocRev();
      }
    },
    onError: () => setSubPartBeingAdded(false),
  });

  const showSuccessToast = (
    relatedPartAdded: RelatedPartsListItem,
    viewRelatedPart: (docRevId: string, documentId: string) => void) => {

    if (relatedPartAdded) {
      toastSuccess(<SuccessMsg docId={`${relatedPartAdded.rootDocId}-${relatedPartAdded.suffixNumber}`}
        viewRelatedPart={viewRelatedPart} documentRevisionId={relatedPartAdded.documentRevisionId}
        documentId={relatedPartAdded.documentId}/>, {
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

  // Fetch related parts list
  const fetchAllRelatedPartsAction = useActionCreator(relatedPartsActions.fetchAllRelatedParts);
  const fetchRelatedPartsAsync = useAsync({
    onSuccess: (relatedPartsList) => {
      relatedPartsState.setRelatedPartsList(relatedPartsList as RelatedPartsListItem[]);
    },
  });
  const fetchRelatedParts = useCallback((documentRevisionId) => {
    fetchRelatedPartsAsync.start(fetchAllRelatedPartsAction, documentRevisionId, fetchRelatedPartsAsync);
  }, [fetchAllRelatedPartsAction, fetchRelatedPartsAsync]);

  // Obsolete Related part
  const voidRelatedPartAction = useActionCreator(relatedPartsActions.voidRelatedPart);
  const voidRelatedPartAsync = useAsync({
    onSuccess: ({ docRevId, name, revisionChangeType }: any) => {
      relatedPartsState.updateRelatedPartsList(docRevId, { name, revisionChangeType });
    },
  });
  const voidRelatedPart = (listItem: RelatedPartsListItem, revisionChangeType: RevisionChangeType) => {
    voidRelatedPartAsync.start(voidRelatedPartAction,
      listItem.documentRevisionId, revisionChangeType, voidRelatedPartAsync);
  };

  // Delete Related part
  const removeRelatedPartAction = useActionCreator(relatedPartsActions.removeRelatedPart);
  const removeRelatedPartAsync = useAsync({
    onSuccess: ({ docRevId }: any) => relatedPartsState.filterRelatedPartsList(docRevId),
  });
  const handleRemove = (docRevId: string) => {
    removeRelatedPartAsync.start(removeRelatedPartAction, docRevId, removeRelatedPartAsync);
  };

  // Update Related part
  const updateRelatedPartAction = useActionCreator(relatedPartsActions.updateRelatedPart);
  const updateRelatedPartAsync = useAsync({
    onSuccess: ({ docRevId, suffixNumber, suffixName, rootDocId }: any) => {
      relatedPartsState.updateRelatedPartsList(docRevId, { suffixNumber, suffixName, rootDocId });
    },
  });
  const handleUpdate = (docRevId: string, suffixNumber: string, suffixName: string) => {
    const data = { suffixNumber, suffixName };
    updateRelatedPartAsync.start(updateRelatedPartAction, docRevId, data, updateRelatedPartAsync);
  };

  // Creating Related part
  const createNewDocument = (relatedPartDetails?) => {
    if (isSubPartBeingAdded) {
      return;
    }

    let docDto = {
      formDocument: {
        id: get(documentRevision, "formDocumentId"),
      },
      description: "",
      name: "",
      suffixName: "",
      attachments: [],
      referenceTo: [],
      revisionStage: get(documentRevision, "revisionStage"),
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

    setSubPartBeingAdded(true);
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
    <RelatedParts
      parentStatus = {parentPartStatus}
      parentStatusChanged = {parentPartStatusChanged}
      {...{
        documentRevision,
        createNewDocument,
        viewRelatedPart,
        handleRemove,
        handleUpdate,
        fetchRelatedParts,
        voidRelatedPart,
        relatedPartsState,
      }}
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
