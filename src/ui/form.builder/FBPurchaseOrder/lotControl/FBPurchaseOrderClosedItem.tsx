/* eslint-disable react/style-prop-object */
import { Box, Button } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";

interface Props {
  document: DocumentRevision;
}
const FBPurchaseOrderClosedItem: React.FunctionComponent<Props> = ({
  document,
}) => {
  console.log(document);
  return (
    <Box margin="10px 0">
      <Button>
        <Text translation="form.builder.reopen.item" />
      </Button>
    </Box>
  );
};

export default FBPurchaseOrderClosedItem;
