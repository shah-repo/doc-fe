import { action, observable, set } from "mobx";
import { PurchaseOrderItem } from "../FBPurchaseOrder/FBPurchaseOrder.types";
import FBStore from "../stores/ui/FBStore";

export class FBReceivePOState {
  @observable public name = "";
  @observable public poId = "";
  @observable public items: PurchaseOrderItem[] = [];

  @action public setItems = (lineItems: PurchaseOrderItem[]) => {
    set(this, "items", lineItems);
    console.log(lineItems);
    console.log(this.updateFBStore);
    // this.updateFBStore();
  };

  @action public setPOId = (poId: string) => {
    set(this, "poId", poId);
    // this.updateFBStore();
  };
  @action public initialize = () => {
    if (!this.name) {
      return;
    }
    // const values = FBStore.getValue(this.name);
    // this.poId = values.poId;
    // this.items = values.items;
  };

  private updateFBStore = () => {
    if (!this.name || FBStore.mode === "design") {
      return;
    }

    /*
    FBStore.setValue(this.name, {
      poId: this.poId,
      items: this.items,
    });
    */
    FBStore.resetSchema();
  };

}

export default FBReceivePOState;
