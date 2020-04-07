/* eslint-disable react/style-prop-object */
import { Button } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
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
import { PurchaseOrderItem } from "../FBPurchaseOrder.types";

interface Props {
  document: DocumentRevision;
  item: PurchaseOrderItem;
}
const FBPurchaseOrderCreateLot: React.FunctionComponent<Props> = ({
  document,
  item,
}) => {
  const LOT = "LOT";
  const intl = useIntl();

  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const docType = useGetDocTypeByAcronym(LOT);
  const createDocumentAction = useActionCreator(documentRevisionsActions.create);
  const createDocumentAsync = useAsync<DocumentRevision>({
    onSuccess: (docRev ) => {
      const path = docRev && documentPreviewPath(docRev.id, docRev.document.id);
      window.open(path, "_blank");
    },
    onError: () => {
      alert(intl.formatMessage({ id: "form.builder.po.lot.wasnt.created" }));
    },
  });
  const loadDocumentProposedIdAction = useActionCreator(documentsActions.loadDocumentProposedIdWithCallback);
  const loadDocumentProposedIdAsync = useAsync<DocumentProposedId>({
    onSuccess: (proposedDocId) => {
      createLot(proposedDocId?.docId || "");
    },
    onError: () => {
      alert(intl.formatMessage({ id: "form.builder.po.lot.wasnt.created" }));
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
      description: `${item.glCode}-${item.description}`,
      attachments: [],
      referenceTo: [{ value: document.document.id, label: "" }],
      securityEmployees: [],
      securityGroups,
      document: {
        docId,
        documentType: { id: docType?.id },
      },
      revisionStage: 1,
      revisionChangeType: RevisionChangeType.NextRevision,
    });
    createDocumentAsync.start(createDocumentAction, values, createDocumentAsync);
  };
  const startLotCreation = () => {
    if (!docType) {
      alert(intl.formatMessage({ id: "form.builder.po.no.document.lot" }));
      return;
    }
    loadDocumentProposedIdAsync.start(loadDocumentProposedIdAction, LOT, loadDocumentProposedIdAsync);
  };

  return (
    <Button
      onClick={startLotCreation}
      color="secondary"
      variant="contained"
      size="small"
    >
      <Text translation="form.builder.po.create.lot" />
    </Button>
  );
};

export default FBPurchaseOrderCreateLot;
