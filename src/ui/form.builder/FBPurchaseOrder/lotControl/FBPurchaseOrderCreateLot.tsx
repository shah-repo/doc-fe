/* eslint-disable react/style-prop-object */
import { Button } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { DocumentRevision, documentRevisionsActions, RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import { DocumentProposedId, documentsActions } from "../../../../state/ducks/documents";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Text from "../../../components/Text";
import { toNewVersionRequestBody } from "../../../documentRevision/forms/transform";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useGetDocTypeByAcronym from "../../../hooks/useGetDocTypeByAcronym";

interface Props {
  document: DocumentRevision;
}
const FBPurchaseOrderCreateLot: React.FunctionComponent<Props> = ({
  document,
}) => {
  const LOT = "LOT";

  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const docType = useGetDocTypeByAcronym(LOT);
  const createDocumentAction = useActionCreator(documentRevisionsActions.create);
  const createDocumentAsync = useAsync({
    onSuccess: (doc) => {
      console.log(doc);
    },
  });
  const loadDocumentProposedIdAction = useActionCreator(documentsActions.loadDocumentProposedIdWithCallback);
  const loadDocumentProposedIdAsync = useAsync<DocumentProposedId>({
    onSuccess: (proposedDocId) => {
      createLot(proposedDocId?.docId || "");
    },
    onError: () => {
      alert("Lot couldn't be created");
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
      name: "API LOT 1",
      description: "API LOT 1",
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
      alert("There's no document type LOT");
      return;
    }
    loadDocumentProposedIdAsync.start(loadDocumentProposedIdAction, LOT, loadDocumentProposedIdAsync);
  };

  return (
    <Button onClick={startLotCreation}>
      <Text translation="form.builder.create.lot" />
    </Button>
  );
};

export default FBPurchaseOrderCreateLot;
