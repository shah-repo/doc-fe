import { Dictionary } from "lodash";
import { action, observable, set } from "mobx";
import { PurchaseOrderItem } from "../FBPurchaseOrder/FBPurchaseOrder.types";
import FBStore from "../stores/ui/FBStore";
import { FBInputProps } from "../types/common";
import { FBEditorElementType } from "../types/editor";

export class FBReceivePOState {
  @observable public name = "";
  @observable public poId = "";
  @observable public items: PurchaseOrderItem[] = [];
  @observable public fieldNames: string[] = [];
  @observable public poFormInput = {};
  @observable public poSchema: FBInputProps[] = [];

  @action public setItems = (lineItems: PurchaseOrderItem[]) => {
    set(this, "items", lineItems);
    this.updateFBStore();
  };

  @action public setPOId = (poId: string) => {
    set(this, "poId", poId);
    this.updateFBStore();
  };

  @action public setFieldNames = (fieldNames: string[]) => {
    set(this, "fieldNames", fieldNames);
    this.updateFBStore();
  };

  @action public setPOFormInput = (poFormInput: Dictionary<any>) => {
    set(this, "poFormInput", poFormInput);
    this.updateFBStore();
  };

  @action public setPOSchema = (poSchema: FBInputProps[]) => {
    set(this, "poSchema", poSchema);
    this.updateFBStore();
  };

  @action public updateSchema = () => {
    const receiveIndex = (FBStore.getSchema()
      .find((item) => item.type as FBEditorElementType  === "receivepurchaseorder")
      ?.index || 0) + 1;
    const mergedSchemas = [
      ...FBStore.getSchema().slice(0, receiveIndex),
      ...this.poSchema,
      ...FBStore.getSchema().slice(receiveIndex),
    ];

    FBStore.setSchema(mergedSchemas);
  };

  @action public updateFormInput = () => {
    FBStore.setValues({
      ...FBStore.getValues(),
      ...this.poFormInput,
    });
  };

  @action public clear = () => {
    this.fieldNames.forEach((name) => {
      FBStore.setValue(name, undefined);
      FBStore.removeSchemaItem(FBStore.getSchemaItemByName(name)?.index);
    });
    this.setItems([]);
    this.setPOId("");
    this.setFieldNames([]);
    this.setPOFormInput({});
    this.setPOSchema([]);
  };

  @action public clearFormValues = () => {
    FBStore.setValue(`${this.name}-formValues.id`, undefined);
  };

  @action public initialize = () => {
    if (!this.name) {
      return;
    }
    const values = FBStore.getValue(this.name);
    this.poId = values.poId || "";
    this.items = values.items || [];
    this.fieldNames = values.fieldNames || [];
    this.poFormInput = values.poFormInput || {};
    this.poSchema = values.poSchema || [];
  };

  private updateFBStore = () => {
    if (!this.name || FBStore.mode === "design") {
      return;
    }

    FBStore.setValue(this.name, {
      poId: this.poId,
      items: this.items,
      fieldNames: this.fieldNames,
      poFormInput: this.poFormInput,
      poSchema: this.poSchema,
    });
  };

}

export default FBReceivePOState;
