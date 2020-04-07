/* eslint-disable react/style-prop-object */
import { Box } from "@material-ui/core";
import React from "react";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import FBStore from "../../stores/ui/FBStore";
import { PurchaseOrderItem } from "../FBPurchaseOrder.types";
import FBPurchaseOrderCreateLot from "./FBPurchaseOrderCreateLot";
import FBPurchaseOrderReceivedItems from "./FBPurchaseOrderReceivedItems";

interface Props {
  item: PurchaseOrderItem;
  isActive: boolean;
}
const FBPurchaseOrderLotControl: React.FunctionComponent<Props> = ({
  item,
  isActive,
}) => {
  const { document } = FBStore;
  const isReleased = document.status === DocumentRevisionStatus.Released;

  if (!isReleased || !isActive) {
    return null;
  }

  return (
    <Box position="absolute">
      <FBPurchaseOrderCreateLot document={document} item={item} />
      <FBPurchaseOrderReceivedItems document={document} item={item} />
    </Box>
  );
};

export default FBPurchaseOrderLotControl;
