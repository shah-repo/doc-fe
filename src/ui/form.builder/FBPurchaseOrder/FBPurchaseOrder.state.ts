import { action, observable, set } from "mobx";
import FBStore from "../stores/ui/FBStore";

export class FBPurchaseOrderState {
  @observable public name = "";
  @observable public po = { items: [] };
  @observable public isDialogOpen = false;
  @observable public formValues = {};

  @action public setItems = (items: any[]) => {
    set(this.po, "items", items);
  };

  @action public deleteItem = (index: number) => {
    const filtered = (this.po.items || [])
      .filter((item, i) => i !== index)
      .map((item: any, index) => ({ ...item, index: index + 1 }));

    this.setItems(filtered);
    this.calculateCost();
  };

  @action public openDialog = () => {
    set(this, "isDialogOpen", true);
  };

  @action public closeDialog = () => {
    set(this, "isDialogOpen", false);
  };

  @action public setFormValues = (values) => {
    set(this, "formValues", values);
  };

  @action public calculateCost = () => {
    this.updateFBStore();
  };

  private updateFBStore = () => {
    if (!this.name) {
      return;
    }

    FBStore.setValue(this.name, this.po);
    FBStore.resetSchema();
  };
}

export default FBPurchaseOrderState;
