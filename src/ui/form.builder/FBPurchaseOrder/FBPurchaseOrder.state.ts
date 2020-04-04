import { action, observable, set } from "mobx";
import { TAX_RATE } from "../helpers/constants";
import FBStore from "../stores/ui/FBStore";

export class FBPurchaseOrderState {
  @observable public name = "";
  @observable public po = { items: [], shippingCost: 0 };
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

  @action public setShippingCost = (shippingCost) => {
    set(this.po, "shippingCost", this.formatCost(shippingCost));
    this.calculateCost();
  };

  @action public calculateCost = () => {
    const sum = (this.po.items || []).reduce(
      (agg, item: any) => {
        const orderCost = Number(item.unitPrice || 0) * Number(item.order || 0);
        const subTotal = agg.subTotal + orderCost;

        let tax = agg.tax;

        if (item.tax) {
          tax += orderCost * TAX_RATE;
        }

        return { subTotal, tax };
      }, { tax: 0, subTotal: 0 },
    );
    const totalAmount = sum.tax + sum.subTotal + Number(this.po.shippingCost || 0);
    set(this.po, "subTotal", this.formatCost(sum.subTotal));
    set(this.po, "tax", this.formatCost(sum.tax));
    set(this.po, "totalAmount", this.formatCost(totalAmount));
    this.updateFBStore();
  };

  private updateFBStore = () => {
    if (!this.name) {
      return;
    }

    FBStore.setValue(this.name, this.po);
    FBStore.resetSchema();
  };

  private formatCost = (value: any) => Number(value || 0).toFixed(2);
}

export default FBPurchaseOrderState;
