export const getReceivedQuantity = (receivedItems, id) => receivedItems.find((receivedItem) => receivedItem.rowId === id)?.received || 0;
