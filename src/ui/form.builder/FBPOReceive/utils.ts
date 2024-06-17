import { FBPurchaseOrderItem } from '../FBPurchaseOrder/FBPurchaseOrder.types';
import { IReceivedItem } from './FBPOReceive.types';

export const getReceivedQuantity = (receivedItems: IReceivedItem[], item: FBPurchaseOrderItem): number =>
  getExistingReceivedItem(receivedItems, item)?.received ?? 0;

export const getExistingReceivedItem = (receivedItems: IReceivedItem[], item: FBPurchaseOrderItem | undefined): IReceivedItem | undefined => {
  return receivedItems.find((receivedItem) => receivedItemEqualityCheck(receivedItem, item));
};

export function receivedItemEqualityCheck (receivedItem: IReceivedItem, item: FBPurchaseOrderItem | undefined): boolean {
  let isEqual = false;
  if (receivedItem.rowId) {
    if (receivedItem.rowId === item?.id) {
      isEqual = true;
    }
  } else if (receivedItem.itemId === (item?.partNumber ?? item?.id)) {
    isEqual = true;
  }

  return isEqual;
}
