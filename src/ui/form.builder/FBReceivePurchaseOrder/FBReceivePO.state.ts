import { action, observable, set } from "mobx";
import { PurchaseOrderItem } from "../FBPurchaseOrder/FBPurchaseOrder.types";
import FBStore from "../stores/ui/FBStore";

export class FBReceivePOState {
  @observable public name = "";
  @observable public items: PurchaseOrderItem[] = [];

  @action public setItems = (lineItems: PurchaseOrderItem[]) => {
    set(this, "items", lineItems);
  };
  @action public initialize = () => {
    if (!this.name) {
      return;
    }
    const value = FBStore.getValue(this.name);
    console.log(value);
    this.updateFBStore();
  };

  private updateFBStore = () => {
    if (!this.name || FBStore.mode === "design") {
      return;
    }

    // FBStore.setValue(this.name, this.po);
    // FBStore.resetSchema();
  };

}

export default FBReceivePOState;
