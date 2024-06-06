import { FBPurchaseOrderItem } from '../FBPurchaseOrder/FBPurchaseOrder.types';
import { IReceivedItem } from './FBPOReceive.types';

export const getReceivedQuantity = (receivedItems: IReceivedItem[], item: FBPurchaseOrderItem): number =>
  receivedItems.find((receivedItem) => {
    if (receivedItem.rowId) {
      if (receivedItem.rowId === item.id) {
        return receivedItem;
      }
    } else if (receivedItem.itemId === item.partNumber) {
      return receivedItem;
    }
  })?.received ?? 0;
