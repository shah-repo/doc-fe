import _ from "lodash";
import { action, observable, set } from "mobx";
import moment from "moment";
import { FB, FBPurchaseOrderCalculation, FBPurchaseOrderItem } from "..";
import { TAX_RATE } from "../helpers/constants";

export class FBPurchaseOrderState  {
  @observable public totalAmount = 0;
  @observable public items: FBPurchaseOrderItem[] = [];
  @observable public calculation: FBPurchaseOrderCalculation = {
    tax: "0.00",
    subTotal: "0.00",
    totalAmount: "0.00",
    shippingCost: "0.00",
  };

  @action public setTotalAmount = (totalAmount: number) => set(this, "totalAmount", totalAmount);

  @action public setShippingCost = (shippingCost?: string) => {
    if (!shippingCost) {
      return;
    }
    set(this.calculation, "shippingCost", this.formatCost(shippingCost));
    this.calculateCost();
  };

  @action public setItem = (item?: FBPurchaseOrderItem) => {
    if (!item) {
      return;
    }
    const items = _.union(this.items, [{
      id: FB.uniqid,
      ...item,
      totalAmount: this.totalAmount.toFixed(2),
      formattedDate: moment(item.date).format("MM/DD/YYYY"),
      index: _.size(this.items) + 1,
    }]);
    set(this, "items", items);
    this.setTotalAmount(0);
    this.calculateCost();
  };

  @action public calculateCost = () => {
    const sum = (this.items || []).reduce(
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
    const totalAmount = sum.tax + sum.subTotal + Number(this.calculation.shippingCost || 0);
    set(this, "calculation", {
      subTotal: this.formatCost(sum.subTotal),
      tax: this.formatCost(sum.tax),
      totalAmount: this.formatCost(totalAmount),
    });
  };

  private formatCost = (value: any) => Number(value || 0).toFixed(2);
}

export default FBPurchaseOrderState;
