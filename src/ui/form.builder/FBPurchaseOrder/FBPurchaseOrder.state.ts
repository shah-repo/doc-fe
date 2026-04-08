import { Dictionary, filter, isEmpty, isNil, isNumber, isUndefined, size, template, toNumber, union } from 'lodash';
import { action, computed, observable, set } from 'mobx';
import moment, { MomentInput } from 'moment';
import { FB, FBPurchaseOrderConstructor, FBPurchaseOrderItem } from '..';
import { TIME_ZONE } from '../../../common/utils/date';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { CurrencyRate, FBCurrency, FBPurchaseOrderValue, ReceiveableQuantity } from '../../form.builder';
import FBRequest from '../FBApi/FBApi.request';
import { getDecimalLength } from '../FBPurchaseOrderTable/helpers';
import { FBEndpoint } from '../defaults/FBEndpoint';
import { DEFAULT_TAX_RATE } from '../helpers/constants';

class FBPurchaseOrderState extends FBRequest<ReceiveableQuantity[], Dictionary<number>> {
  public exchangeRateApi: FBRequest<CurrencyRate, Dictionary<number>> = new FBRequest();
  @observable public itemTotalAmount = 0;
  @observable public hasPartNumber = false;
  @observable public isAllItemsReceived = false;
  @observable public rerenderCurrency = false;
  @observable public isManualTax = false;
  @observable public timezone = TIME_ZONE;
  @observable value: FBPurchaseOrderValue = {
    tax: '0.00',
    taxRate: DEFAULT_TAX_RATE,
    subTotal: '0.00',
    totalAmount: '0.00',
    shippingCost: '0.00',
    currency: 'USD',
    exchangeRate: 1,
    totalInUSD: '0.00',
    dateOfExchangeRate: '',
    items: [],
  };

  @computed public get taxRate (): number {
    return this.value.taxRate;
  }

  @computed public get currency (): FBCurrency {
    return this.value.currency;
  }

  @computed public get exchangeRate (): number {
    return this.value.exchangeRate;
  }

  public partApi = new FBRequest<DocumentRevision, null>();

  public getPartsVersion = (): void => {
    const parts = this.value.items.filter((item) => item.partNumber);
    this.fetchPartDocument(parts);
  };

  private readonly fetchPartDocument = (parts: FBPurchaseOrderItem[]) => {
    if (isUndefined(parts) || parts.length === 0) {
      return;
    }

    const part = parts.pop();
    if (!part) {
      return;
    }

    this.partApi.set({
      url: `${FBEndpoint.DocumentRevisionsUrl}/${part.partNumber}`,
      method: 'get',
    }, (data, error) => {
      if (error) {
        this.partApi.onError(error);
      } else {
        this.value.items = this.value.items.map((item) => {
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

  public constructor ({ documentId, ...initialValues }: FBPurchaseOrderConstructor) {
    super();
    if (documentId) {
      this.fetchReceivedItems(documentId);
    }
    if (!initialValues || isEmpty(initialValues)) {
      return;
    }
    const items = (initialValues?.items || []).map((item, index) => ({ ...item, index }));
    this.setValue({ ...initialValues, items });
  }

  @action public setPartNumber = (partNumber?: string): void => {
    set(this, 'hasPartNumber', (!isUndefined(partNumber) && !isEmpty(partNumber)));
  };

  @action public setIsAllItemsReceived = (isAllReceived: boolean): void => {
    set(this, 'isAllItemsReceived', isAllReceived);
  };

  @action public setCurrency = async (currency: FBCurrency): Promise<void> => {
    // FBInput.onchange, line 87
    // on change is triggered twice
    if (this.exchangeRateApi.loading) {
      return;
    }
    const setToUsd = () => {
      this.setValue({ ...this.calculateCost(), currency: 'USD', exchangeRate: 1 });
    };
    if (currency === 'USD') {
      setToUsd();
      return;
    }

    const urlTpl = template(FBEndpoint.Currency);
    const url = urlTpl({ symboName: currency });
    this.exchangeRateApi.setUrl(url);

    try {
      const data = await this.exchangeRateApi?.fetch();
      this.value.currency = currency;
      this.value.exchangeRate = parseFloat(data.rate.toFixed(2));
      this.value.dateOfExchangeRate = moment().tz(this.timezone).format();
      this.reCalculateValue();
    } catch (e) {
      setToUsd();
    }
  };

  @action public setTaxRate = (value?: string): void => {
    if (!value) {
      return;
    }
    const taxRate = Number(this.formatCost(value, 6));
    set(this.value, 'taxRate', taxRate);
    set(this, 'isManualTax', false);
  };

  @action public setTax = (tax?: string): void => {
    if (!tax) {
      return;
    }
    const taxRate = this.getTaxRateByTax(tax);
    if (isNumber(taxRate)) {
      set(this.value, 'taxRate', Number(this.formatCost(taxRate, getDecimalLength(tax))));
    }
    set(this.value, 'tax', tax);
    set(this, 'isManualTax', true);
  };

  @action public setShippingCost = (shippingCost?: string): void => {
    if (!shippingCost) {
      return;
    }
    set(this.value, 'shippingCost', Number(this.formatCost(shippingCost)));
  };

  @action public setValue = (value = {}): void => {
    set(this, 'value', { ...this.value, ...value });
  };

  @action public setItem = (item?: FBPurchaseOrderItem): void => {
    if (!item) {
      return;
    }
    isUndefined(item.index)
      ? this.addItem(item)
      : this.updateItem(item);
    set(this, 'isManualTax', false);
    this.reCalculateValue();
    this.setItemTotalAmount();
  };

  @action public setItemTotalAmount = (item?: FBPurchaseOrderItem): void => {
    const { unitPrice = 0, order = 0 } = item ?? {};
    const itemTotalAmount = toNumber(unitPrice) * toNumber(order);
    set(this, 'itemTotalAmount', itemTotalAmount);
  };

  @action public removeItem = (item?: FBPurchaseOrderItem): void => {
    if (!item) {
      return;
    }
    set(this.value, 'items', filter(this.value.items, (itm) => itm.id !== item.id));
  };

  public calculateItemSum = (): { subTotal: number, forTax: number } => (this.value.items || []).reduce(
    (agg, item) => {
      const orderCost = Number(item.unitPrice || 0) * Number(item.order || 0);
      agg.subTotal += orderCost;
      agg.forTax += item.tax ? orderCost : 0;
      return agg;
    }, { subTotal: 0, forTax: 0 },
  );

  public getTaxRateByTax = (tax: string): number | null => {
    const sum = this.calculateItemSum();
    if (sum.forTax === 0) {
      return null;
    }
    return sum.forTax ? (parseFloat(tax) / sum.forTax * 100) : 0;
  };

  public calculateCost = (): FBPurchaseOrderValue => {
    const sum = this.calculateItemSum();
    const lineItemsLength = this.value.items.length;
    const taxRate = this.value.taxRate;
    let tax = lineItemsLength ? (parseFloat(String(this.value.tax)) || 0) : 0;
    if (!this.isManualTax && lineItemsLength && !isNil(this.value.taxRate)) {
      tax = sum.forTax * this.value.taxRate / 100;
    }

    const roundedTax = Math.round(tax * 100) / 100;
    const shippingCost = lineItemsLength ? this.value.shippingCost || 0 : 0;
    const totalAmount = roundedTax + sum.subTotal + Number(shippingCost);
    const totalInUSD = totalAmount * this.value.exchangeRate;

    const value = {
      ...this.value,
      taxRate,
      subTotal: this.formatCost(sum.subTotal),
      tax: this.formatCost(roundedTax),
      shippingCost: this.formatCost(shippingCost),
      totalAmount: this.formatCost(totalAmount),
      totalInUSD: this.formatCost(totalInUSD),
    };

    return value;
  };

  public reCalculateValue = (): void => {
    const value = this.calculateCost();
    this.setValue(value);
  };

  @action public deleteItem = (index: number): void => {
    this.value.items = this.value.items
      .filter((itm, indx) => indx !== index)
      .map((itm, indx) => ({ ...itm, index: indx }));
    set(this, 'isManualTax', false);
    this.reCalculateValue();
  };

  public onSuccess (): void {
    super.onSuccess();
    this.value.items = this.value.items.reduce<FBPurchaseOrderItem[]>((newItems, item) => {
      const received = this.data?.reduce((total, receiving) => {
        return receiving.key === item[receiving.keyName]
          ? total + receiving.value
          : total;
      }, 0);

      return [
        ...newItems,
        {
          ...item,
          received,
        },
      ];
    }, []);
  }

  private readonly fetchReceivedItems = (documentId: string) => {
    const urlTpl = template(FBEndpoint.ReceivedItemsQuantity);
    const url = urlTpl({ documentId });
    this.setUrl(url);
    this.fetch();
  };

  private readonly formatCost = (value: number | string = 0, fixedDecimal = 2) => {
    const val = Number(value);
    if (val === 0) {
      return val.toFixed(2);
    }
    return val.toFixed(fixedDecimal);
  };

  private readonly formatDate = (date: MomentInput) => date ? moment(date).format('MM/DD/YYYY') : '';

  private readonly addItem = (item: FBPurchaseOrderItem) => {
    this.value.items = union(this.value.items, [{
      ...item,
      id: FB.uniqid,
      received: 0,
      totalAmount: this.itemTotalAmount.toFixed(2),
      formattedDate: this.formatDate(item.date),
      index: size(this.value.items),
    }]);
  };

  private readonly updateItem = (item: FBPurchaseOrderItem) => {
    this.value.items[item.index] = {
      ...item,
      totalAmount: this.itemTotalAmount.toFixed(2),
      formattedDate: this.formatDate(item.date),
    };
  };
}

export default FBPurchaseOrderState;
