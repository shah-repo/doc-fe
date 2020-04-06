/* eslint-disable react/style-prop-object */
import { Button } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { DocumentRevision, documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { documentsActions } from "../../../../state/ducks/documents";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useGetDocTypeByAcronym from "../../../hooks/useGetDocTypeByAcronym";

interface Props {
  document: DocumentRevision;
}
const FBPurchaseOrderCreateLot: React.FunctionComponent<Props> = ({
  document,
}) => {
  const DOCUMENT_REVISION = {
    description: "<p>API create 12:24</p>",
    name: "API create 12:24",
    attachments: [],
    referenceTo: [
      {
        id: "286206b4-ad19-4eeb-8b20-d504e5291884",
      },
    ],
    revisionStage: 1,
    revisionChangeType: "NEXT_REVISION",
    document: {
      docId: "LOT00165",
      securityList: {
        securityEmployees: [],
        securityGroups: [
          {
            id: "4c1fb9ee-621c-463a-b51c-4ea25e82ffb0",
          },
        ],
      },
      documentType: {
        id: "d9d308e1-dc62-4201-94fe-effabbdf3e9e",
      },
    },
  };
  const LOT = "LOT";

  const dispatch = useDispatch();
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const docType = useGetDocTypeByAcronym(LOT);
  const createDocumentAction = useActionCreator(documentRevisionsActions.create);
  const asyncCreateDocument = useAsync({
    onSuccess: (doc) => {
      console.log(doc);
      console.log(asyncCreateDocument);
      console.log(createDocumentAction);
      console.log(DOCUMENT_REVISION);
      console.log(docType);
    },
  });

  const createLot = () => {
    if (!docType) {
      alert("There's no document type LOT");
      return;
    }
    dispatch(documentsActions.loadDocumentProposedId(LOT));
    const securityGroups: any[] = [];
    if (docType.isQms) {
      groupOptions.forEach((group) => {
        if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
          securityGroups.push({ value: group.value, label: group.label });
        }
      });
    }
    console.log("create lot");
  };

  return (
    <Button onClick={createLot}>
      <Text translation="form.builder.create.lot" />
    </Button>
  );
};

export default FBPurchaseOrderCreateLot;
