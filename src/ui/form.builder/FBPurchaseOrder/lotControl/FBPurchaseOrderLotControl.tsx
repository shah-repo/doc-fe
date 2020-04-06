/* eslint-disable react/style-prop-object */
import React from "react";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import FBStore from "../../stores/ui/FBStore";
import { PurchaseOrderItem } from "../FBPurchaseOrder.types";
import FBPurchaseOrderClosedItem from "./FBPurchaseOrderClosedItem";
import FBPurchaseOrderCreateLot from "./FBPurchaseOrderCreateLot";

interface Props {
  item: PurchaseOrderItem;
}
const FBPurchaseOrderLotControl: React.FunctionComponent<Props> = ({
  item,
}) => {
  const { document } = FBStore;
  const isReleased = document.status === DocumentRevisionStatus.Released;

  if (!isReleased) {
    return null;
  }

  return (
    <>
      {!item.isClosed && <FBPurchaseOrderCreateLot document={document} />}
      {item.isClosed && <FBPurchaseOrderClosedItem document={document} />}
    </>
  );
};

export default FBPurchaseOrderLotControl;
