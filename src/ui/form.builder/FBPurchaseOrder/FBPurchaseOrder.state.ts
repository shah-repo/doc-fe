import { action, observable, set } from "mobx";

export class FBPurchaseOrderState  {
  @observable public totalPrice = 0;

  @action public setTotalPrice = (totalPrice: number) => set(this, "totalPrice", totalPrice);
}

export default FBPurchaseOrderState;
