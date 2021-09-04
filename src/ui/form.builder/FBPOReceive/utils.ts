export const getReceivedQuantity = (receivedItems, id) => receivedItems.find( (receivedItem) => receivedItem.itemId === id)?.received || 0;
