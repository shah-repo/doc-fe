import { action, observable, set } from "mobx";
import moment from "moment";
import { TAX_RATE } from "../helpers/constants";
import FBStore from "../stores/ui/FBStore";

const DEFAULT_PO = {
  items: [],
  shippingCost: "0.00",
  tax: "0.00",
  subTotal: "0.00",
  totalAmount: "0.00",
};

export class FBPurchaseOrderState {
  @observable public name = "";
  @observable public po = DEFAULT_PO;
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

  @action public setFormValues = (item) => {
    FBStore.setValue(`${this.name}-formValues`, item);
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

  @action public initialize = (shippingCost) => {
    if (!this.name) {
      return;
    }
    const value = FBStore.getValue(this.name) || DEFAULT_PO;

    // this method is used to format old PO values into new correct values
    this.po = {
      items: value.items.map(this.initiliazeLineItem),
      shippingCost: this.formatCost(value.shippingCost),
      subTotal: this.formatCost(value.subTotal),
      tax: this.formatCost(value.tax),
      totalAmount: this.formatCost(value.totalAmount),
    };
    this.calculateCost();
  };

  private updateFBStore = () => {
    if (!this.name) {
      return;
    }

    FBStore.setValue(this.name, this.po);
    FBStore.resetSchema();
  };

  private formatCost = (value: any) => Number(value || 0).toFixed(2);

  private initiliazeLineItem = (item, index) => (
    {
      index: index + 1,
      order: item.order,
      glCode: item.glCode,
      units: item.units,
      partNumber: item.partNumber,
      date: item.date,
      description: item.description,
      unitPrice: this.formatCost(item.unitPrice),
      tax: item.tax,
      isTraceabilityRequired: item.isTraceabilityRequired,
      capitalEquipment: item.capitalEquipment,
      formattedDate: item.formattedDate || moment(item.date).format("MM/DD/YYYY"),
      totalAmount: (() => {
        const total = Number(item.order) * Number(item.unitPrice);
        const tax = item.tax ? total * TAX_RATE : 0;
        return this.formatCost(total + tax);
      })(),
    }
  );
}

export default FBPurchaseOrderState;
