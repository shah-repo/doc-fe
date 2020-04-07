/* eslint-disable react/style-prop-object */
import { Button } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import { PurchaseOrderItem } from "../FBPurchaseOrder.types";

interface Props {
  document: DocumentRevision;
  item: PurchaseOrderItem;
}
const FBPurchaseOrderReceivedItems: React.FunctionComponent<Props> = ({
  item,
}) => {
  console.log(item);
  return (
    <Button
      color="secondary"
      variant="contained"
      size="small"
    >
      <Text translation="form.builder.po.received.items" />
    </Button>
  );
};

export default FBPurchaseOrderReceivedItems;
