import { Dictionary } from "lodash";
import { action, observable, set } from "mobx";
import uniqid from "uniqid";
import { PurchaseOrderItem } from "../FBPurchaseOrder/FBPurchaseOrder.types";
import FBStore from "../stores/ui/FBStore";
import { FBInputProps } from "../types/common";
import { FBEditorElementType } from "../types/editor";

export class FBReceivePOState {
  @observable public name = "";
  @observable public poId = "";
  // NOTE: this is hardcoded to test lot creation, needs to be removed
  @observable public poDocumentId = "";
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

  @action public setPODocumentId = (poDocumentId: string) => {
    set(this, "poDocumentId", poDocumentId);
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
    const schemaWithId = poSchema.map((item) => ({
      ...item,
      id: uniqid(),
    }));
    set(this, "poSchema", schemaWithId);
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

  @action public submit = (index, received, docRevId, documentId) => {
    const receivedList = (this.items[index].receivedList || [])
      .concat({ id: uniqid(), received, docRevId, documentId });
    const totalReceived = (this.items[index].received || 0) + Number(received);
    this.items[index] = {
      ...this.items[index],
      receivedList,
      received: totalReceived,
    };
    this.updateFBStore();
  };

  @action public clear = () => {
    this.fieldNames.forEach((name) => {
      FBStore.setValue(name, undefined);
      FBStore.removeSchemaItem(FBStore.getSchemaItemByName(name)?.index);
    });
    this.setItems([]);
    this.setPOId("");
    this.setPODocumentId("");
    this.setFieldNames([]);
    this.setPOFormInput({});
    this.setPOSchema([]);
  };

  @action public clearFormValues = () => {
    FBStore.setValue(`${this.name}-formValues.received`, undefined);
    FBStore.setValue(`${this.name}-formValues.comments`, undefined);
    FBStore.setValue(`${this.name}-formValues`, undefined);
  };

  @action public initialize = () => {
    if (!this.name) {
      return;
    }
    const values = FBStore.getValue(this.name) || {};
    this.poId = values.poId || "";
    this.poDocumentId = values.poDocumentId || "";
    this.items = values.items || [];
    this.fieldNames = values.fieldNames || [];
    this.poFormInput = values.poFormInput || {};
    this.poSchema = values.poSchema || [];

    this.updateSchema();
    this.updateFormInput();
  };

  private updateFBStore = () => {
    if (!this.name || FBStore.mode === "design") {
      return;
    }

    FBStore.setValue(this.name, {
      poDocumentId: this.poDocumentId,
      poId: this.poId,
      items: this.items,
      fieldNames: this.fieldNames,
      poFormInput: this.poFormInput,
      poSchema: this.poSchema,
    });
  };

}

export default FBReceivePOState;
