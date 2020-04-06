/* eslint-disable react/style-prop-object */
import { Box, Button } from "@material-ui/core";
import React from "react";
import { DocumentRevision, documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";

interface Props {
  document: DocumentRevision;
}
const FBPurchaseOrderOpenItem: React.FunctionComponent<Props> = ({
  document,
}) => {
  const createDocumentAction = useActionCreator(documentRevisionsActions.create);
  const async = useAsync({
    onSuccess: (doc) => {
      console.log(doc);
    },
  });

  const closeItem = () => {
    console.log(createDocumentAction);
    console.log(async);
    console.log("close item");
  };

  const createLot = () => {
    console.log("create lot");
  };

  return (
    <Box margin="10px 0">
      <Button onClick={closeItem}>
        <Text translation="form.builder.close.item" />
      </Button>
      <Button onClick={createLot}>
        <Text translation="form.builder.create.lot" />
      </Button>
    </Box>
  );
};

export default FBPurchaseOrderOpenItem;
