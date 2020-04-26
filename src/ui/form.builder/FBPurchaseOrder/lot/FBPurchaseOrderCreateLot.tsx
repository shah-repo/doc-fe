import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Slide, toast } from "react-toastify";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { DocumentRevision, documentRevisionsActions, RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import { DocumentProposedId, documentsActions } from "../../../../state/ducks/documents";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Text from "../../../components/Text";
import { documentPreviewPath } from "../../../document.revision/utils/paths";
import { toNewVersionRequestBody } from "../../../documentRevision/forms/transform";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useGetDocTypeByAcronym from "../../../hooks/useGetDocTypeByAcronym";
import FBStore from "../../stores/ui/FBStore";
import { PurchaseOrderItem } from "../FBPurchaseOrder.types";

interface Props {
  item: PurchaseOrderItem;
}
const FBPurchaseOrderCreateLot: React.FunctionComponent<Props> = ({
  item,
}) => {
  const [isCreatingLot, setIsCreatingLot] = useState(false);
  const { document } = FBStore;
  const LOT = "LOT";
  const intl = useIntl();

  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const docType = useGetDocTypeByAcronym(LOT);
  const createDocumentAction = useActionCreator(documentRevisionsActions.create);
  const createDocumentAsync = useAsync<DocumentRevision>({
    onSuccess: (docRev ) => {
      const path = docRev && documentPreviewPath(docRev.id, docRev.document.id);
      window.open(path, "_blank");
      setIsCreatingLot(false);
    },
    onError: () => {
      toastError("form.builder.po.lot.wasnt.created");
      setIsCreatingLot(false);
    },
  });
  const loadDocumentProposedIdAction = useActionCreator(documentsActions.loadDocumentProposedIdWithCallback);
  const loadDocumentProposedIdAsync = useAsync<DocumentProposedId>({
    onSuccess: (proposedDocId) => {
      createLot(proposedDocId?.docId || "");
    },
    onError: () => {
      toastError("form.builder.po.lot.wasnt.created");
      setIsCreatingLot(false);
    },
  });

  const createLot = (docId: string) => {
    const securityGroups: any[] = [];
    if (docType?.isQms) {
      groupOptions.forEach((group) => {
        if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
          securityGroups.push({ value: group.value, label: group.label });
        }
      });
    }

    const values = toNewVersionRequestBody({
      name: `${item.glCode}-${item.description}`,
      description: `<p>${item.glCode}-${item.description}</p>`,
      attachments: [],
      referenceTo: [{ value: document?.document?.id || "", label: "" }],
      securityEmployees: [],
      securityGroups,
      document: {
        docId,
        documentType: { id: docType?.id },
      },
      revisionStage: 1,
      revisionChangeType: RevisionChangeType.NextRevision,
      renderHTML: undefined,
    });

    createDocumentAsync.start(createDocumentAction, values, createDocumentAsync);
  };
  const toastError = (message: string) => {
    toast.error(
      intl.formatMessage({ id: message }),
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      }
    );
  };
  const startLotCreation = () => {
    if (!docType) {
      toastError("form.builder.po.no.document.lot");
      return;
    }
    setIsCreatingLot(true);
    loadDocumentProposedIdAsync.start(loadDocumentProposedIdAction, LOT, loadDocumentProposedIdAsync);
  };

  return (
    <Button
      onClick={startLotCreation}
      color="secondary"
      variant="contained"
      disabled={isCreatingLot}
      type="button"
    >
      <Text translation="form.builder.po.create.lot" />
    </Button>
  );
};

export default FBPurchaseOrderCreateLot;
