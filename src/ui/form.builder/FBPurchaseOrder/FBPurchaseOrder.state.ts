import { Dictionary, filter, isEmpty, isUndefined, omit, reduce, size, template, toNumber, union } from "lodash";
import { action, observable, set } from "mobx";
import moment from "moment";
import { FB, FBPurchaseOrderCalculation, FBPurchaseOrderConstructor, FBPurchaseOrderItem } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { TAX_RATE } from "../helpers/constants";
import { FBCurrency } from "./FBPurchaseOrder.types";

class FBPurchaseOrderState extends FBRequest<any, Dictionary<number>> {
  public exchangeRate: FBRequest<any, Dictionary<number>> = new FBRequest();
  @observable public itemTotalAmount = 0;
  @observable public items: FBPurchaseOrderItem[] = [];
  @observable public calculation: FBPurchaseOrderCalculation = {
    tax: "0.00",
    subTotal: "0.00",
    totalAmount: "0.00",
    shippingCost: "0.00",
    currency: "USD",
    exchangeRate: 1,
    totalInUSD: "0.00",
    dateOfExchangeRate: "",
  };

  public partApi = new FBRequest<DocumentRevision, null>();

  public getPartsVersion = () => {
    const parts = this.items.filter( (item) => item.partNumber);
    this.fetchPartDocument(parts);
  };

  private fetchPartDocument = (parts: FBPurchaseOrderItem[]) => {
    if (isUndefined(parts) || parts.length === 0) {
      return;
    }

    const part = parts.pop();
    if (!part) {
      return;
    }

    this.partApi.set({
      url: `${FBEndpoint.DocumentRevisionsUrl}/${part.partNumber}`,
      method: "get",
    }, (data, error) => {
      if (error) {
        this.partApi.onError(error);
      } else {
        this.items = this.items.map( (item) => {
          if (item.partNumber === part.partNumber) {
            item.status = data?.status;
          }
          return item;
        });
        this.partApi.onSuccess();
      }
    });
    this.fetchPartDocument(parts);
  };

  public constructor({ documentId, ...initialValues }: FBPurchaseOrderConstructor) {
    super();
    if (!initialValues || isEmpty(initialValues)) {
      return;
    }
    if (documentId) {
      this.fetchReceivedItems(documentId);
    }
    const items = (initialValues?.items || [])
      .map((item, index) => ({ ...item, index }));
    const calculation = omit(initialValues, "items");
    set(this, "items", items);
    set(this, "calculation", { ...this.calculation, ...calculation });
  }

  @action public setItemTotalAmount = (item?: FBPurchaseOrderItem) => {
    const { unitPrice = 0, order = 0 } = item || {};
    const itemTotalAmount = toNumber(unitPrice) * toNumber(order);
    set(this, "itemTotalAmount", itemTotalAmount);
  };

  @action public setShippingCost = (shippingCost?: string) => {
    if (!shippingCost) {
      return;
    }
    set(this.calculation, "shippingCost", this.formatCost(shippingCost));
    this.calculateCost();
  };

  @action public setTax = (tax?: string) => {
    if (!tax) {
      return;
    }
    set(this.calculation, "tax", tax);
  };

  @action public setCurrency = async (currency: FBCurrency) => {
    // FBInput.onchange, line 87
    // on change is triggered twice
    if (this.exchangeRate.loading) {
      return;
    }
    const setToUsd = () => {
      set(this.calculation, "currency", "USD");
      set(this.calculation, "exchangeRate", 1);
      this.calculateCost();
    };
    if (currency === "USD") {
      setToUsd();
      return;
    }

    const urlTpl = template(FBEndpoint.Currency);
    const url = urlTpl({ symboName: currency });
    this.exchangeRate.setUrl(url);

    try {
      const data = await this.exchangeRate.fetch();
      set(this.calculation, "currency", currency);
      set(this.calculation, "exchangeRate", parseFloat(data.rate.toFixed(2)));
      set(this.calculation, "dateOfExchangeRate", moment().format("LL"));
      this.calculateCost();
    } catch (e) {
      setToUsd();
    }
  };

  @action public setItem = (item?: FBPurchaseOrderItem) => {
    if (!item) {
      return;
    }
    const items: FBPurchaseOrderItem[] = isUndefined(item.index)
      ? this.addItem(item)
      : this.updateItem(item);
    set(this, "items", items);
    this.setItemTotalAmount();
    this.calculateCost();
  };

  @action public removeItem = (item?: FBPurchaseOrderItem) => {
    if (!item) {
      return;
    }
    set(this, "items", filter(this.items, (itm) => itm.id !== item.id));
  };

  @action public setItems = (items?: FBPurchaseOrderItem[]) => {
    if (!items) {
      return;
    }
    set(this, "items", items);
  };

  @action public calculateCost = (taxField?: string) => {
    taxField = taxField || TAX_RATE;

    const isTaxPercent = !!taxField?.endsWith("%");
    const taxFieldValue: number = parseFloat(taxField);
    let tax: number = isTaxPercent ? 0 : taxFieldValue;

    const sum = (this.items || []).reduce(
      (agg, item: any) => {
        const orderCost = Number(item.unitPrice || 0) * Number(item.order || 0);
        const subTotal = agg.subTotal + orderCost;
        (item.tax && isTaxPercent) && (tax += orderCost * (taxFieldValue / 100));
        return { subTotal, tax };
      }, { tax: 0, subTotal: 0 },
    );

    const shippingCost = this.calculation.shippingCost || 0;
    const totalAmount = tax + sum.subTotal + Number(shippingCost);
    const totalInUSD = totalAmount * this.calculation.exchangeRate;

    set(this, "calculation", {
      ...this.calculation,
      subTotal: this.formatCost(sum.subTotal),
      tax: this.formatCost(tax),
      shippingCost: this.formatCost(shippingCost),
      totalAmount: this.formatCost(totalAmount),
      totalInUSD: this.formatCost(totalInUSD),
    });
  };

  @action public deleteItem = (index: number) => {
    const items = this.items
      .filter((itm, indx) =>
        indx !== index
      ).map((itm, indx) => ({
        ...itm,
        index: indx,
      }));
    set(this, "items", items);
    this.calculateCost();
  };

  public onSuccess() {
    super.onSuccess();
    const items = reduce(this.items, (reduced: FBPurchaseOrderItem[], item) => {
      if (!item.partNumber) {
        reduced.push({
          ...item,
          received: this.data[item.id] ?? 0,
        });
        return reduced;
      }
      reduced.push({
        ...item,
        received: this.data[item.partNumber] ?? 0,
      });
      return reduced;
    }, []);
    this.items = items;
  }

  private fetchReceivedItems = (documentId: string) => {
    const urlTpl = template(FBEndpoint.ReceivedItemsQuantity);
    const url = urlTpl({ documentId });
    this.setUrl(url);
    this.fetch();
  };

  private formatCost = (value: any) => Number(value || 0).toFixed(2);

  private formatDate = (date) => date ? moment(date).format("MM/DD/YYYY") : "";

  private addItem = (item: FBPurchaseOrderItem): FBPurchaseOrderItem[] => union(this.items, [{
    id: FB.uniqid,
    ...item,
    received: 0,
    totalAmount: this.itemTotalAmount.toFixed(2),
    formattedDate: this.formatDate(item.date),
    index: size(this.items),
  }]);

  private updateItem = (item: FBPurchaseOrderItem): FBPurchaseOrderItem[] => {
    this.items[item.index] = {
      ...item,
      totalAmount: this.itemTotalAmount.toFixed(2),
      formattedDate: this.formatDate(item.date),
    };
    return this.items;
  };
}

export default FBPurchaseOrderState;
