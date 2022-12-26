import { Dictionary, filter, isEmpty, isNumber, isUndefined, reduce, size, template, toNumber, union } from "lodash";
import { action, observable, set } from "mobx";
import moment from "moment";
import { FB, FBPurchaseOrderConstructor, FBPurchaseOrderItem } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { TAX_RATE } from "../helpers/constants";
import { FBCurrency, FBPurchaseOrderValue } from "./FBPurchaseOrder.types";

class FBPurchaseOrderState extends FBRequest<any, Dictionary<number>> {
  public exchangeRate: FBRequest<any, Dictionary<number>> = new FBRequest();
  @observable public itemTotalAmount = 0;
  @observable public hasPartNumber = false;
  @observable value: FBPurchaseOrderValue = {
    tax: "0.00",
    taxRate: TAX_RATE,
    subTotal: "0.00",
    totalAmount: "0.00",
    shippingCost: "0.00",
    currency: "USD",
    exchangeRate: 1,
    totalInUSD: "0.00",
    dateOfExchangeRate: "",
    items: [],
  };

  public partApi = new FBRequest<DocumentRevision, null>();

  public getPartsVersion = () => {
    const parts = this.value.items.filter( (item) => item.partNumber);
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
        this.value.items = this.value.items.map( (item) => {
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
    const items = (initialValues?.items || []).map((item, index) => ({ ...item, index }));
    set(this, "value", { ...initialValues, items });
  }

  @action public setPartNumber = (partNumber?: string) => {
    set(this, "hasPartNumber", (!isUndefined(partNumber) && !isEmpty(partNumber)));
  };

  @action public setCurrency = async (currency: FBCurrency) => {
    // FBInput.onchange, line 87
    // on change is triggered twice
    if (this.exchangeRate.loading) {
      return;
    }
    const setToUsd = () => {
      this.setValue({ ...this.calculateCost(), currency: "USD", exchangeRate: 1 });
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
      this.value.currency = currency;
      this.value.exchangeRate = parseFloat(data.rate.toFixed(2));
      this.value.dateOfExchangeRate = moment().format("LL");
      this.reCalculateValue();
    } catch (e) {
      setToUsd();
    }
  };

  @action public setTaxRate = (value?: string) => {
    if (!value) {
      return;
    }
    const taxRate = Number(this.formatCost(value, 6));
    set(this.value, "taxRate", taxRate);
  };

  @action public setTax = (tax?: string) => {
    if (!tax) {
      return;
    }
    const taxRate = this.getTaxRateByTax(tax);
    if (isNumber(taxRate)) {
      set(this.value, "taxRate", Number(this.formatCost(taxRate, 6)));
    }
    set(this.value, "tax", tax);
  };

  @action public setShippingCost = (shippingCost?: string) => {
    if (!shippingCost) {
      return;
    }
    set(this.value, "shippingCost", this.formatCost(shippingCost));
  };

  @action public setValue = (value = {}) => {
    set(this, "value", { ...this.value, ...value });
  };

  @action public setItem = (item?: FBPurchaseOrderItem) => {
    if (!item) {
      return;
    }
    isUndefined(item.index)
      ? this.addItem(item)
      : this.updateItem(item);
    this.reCalculateValue();
    this.setItemTotalAmount();
  };

  @action public setItemTotalAmount = (item?: FBPurchaseOrderItem) => {
    const { unitPrice = 0, order = 0 } = item || {};
    const itemTotalAmount = toNumber(unitPrice) * toNumber(order);
    set(this, "itemTotalAmount", itemTotalAmount);
  };

  @action public removeItem = (item?: FBPurchaseOrderItem) => {
    if (!item) {
      return;
    }
    set(this.value, "items", filter(this.value.items, (itm) => itm.id !== item.id));
  };

  public calculateItemSum = () => (this.value.items || []).reduce(
    (agg, item: any) => {
      const orderCost = Number(item.unitPrice || 0) * Number(item.order || 0);
      agg.subTotal += orderCost;
      agg.forTax += item.tax ? orderCost : 0;
      return agg;
    }, { subTotal: 0, forTax: 0 },
  );

  public getTaxRateByTax = (tax) => {
    const sum = this.calculateItemSum();
    if (sum.forTax === 0) {
      return null;
    }
    return sum.forTax ? (parseFloat(tax) / sum.forTax * 100) : 0;
  };

  public calculateCost = (): FBPurchaseOrderValue => {
    const sum = this.calculateItemSum();
    const tax = sum.forTax ? (sum.forTax * this.value.taxRate / 100) : 0;

    const shippingCost = this.value.shippingCost || 0;
    const totalAmount = tax + sum.subTotal + Number(shippingCost);
    const totalInUSD = totalAmount * this.value.exchangeRate;

    const value = {
      ...this.value,
      subTotal: this.formatCost(sum.subTotal),
      tax: this.formatCost(tax, 6),
      shippingCost: this.formatCost(shippingCost),
      totalAmount: this.formatCost(totalAmount),
      totalInUSD: this.formatCost(totalInUSD),
    };

    return value;
  };

  public reCalculateValue = () => {
    const value = this.calculateCost();
    this.setValue(value);
  };

  @action public deleteItem = (index: number) => {
    this.value.items = this.value.items
      .filter((itm, indx) => indx !== index)
      .map((itm, indx) => ({ ...itm, index: indx }));
    this.reCalculateValue();
  };

  public onSuccess() {
    super.onSuccess();
    const items = reduce(this.value.items, (reduced: FBPurchaseOrderItem[], item) => {
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
    this.value.items = items;
  }

  private fetchReceivedItems = (documentId: string) => {
    const urlTpl = template(FBEndpoint.ReceivedItemsQuantity);
    const url = urlTpl({ documentId });
    this.setUrl(url);
    this.fetch();
  };

  private formatCost = (value: any, fixedDecimal?: number) => {
    const val = Number(value || 0);
    if (val === 0) {
      return val.toFixed(2);
    }
    return val.toFixed(fixedDecimal || 2);
  };

  private formatDate = (date) => date ? moment(date).format("MM/DD/YYYY") : "";

  private addItem = (item: FBPurchaseOrderItem) => {
    this.value.items = union(this.value.items, [{
      ...item,
      id: FB.uniqid,
      received: 0,
      totalAmount: this.itemTotalAmount.toFixed(2),
      formattedDate: this.formatDate(item.date),
      index: size(this.value.items),
    }]);
  };

  private updateItem = (item: FBPurchaseOrderItem) => {
    this.value.items[item.index] = {
      ...item,
      totalAmount: this.itemTotalAmount.toFixed(2),
      formattedDate: this.formatDate(item.date),
    };
  };
}

export default FBPurchaseOrderState;
