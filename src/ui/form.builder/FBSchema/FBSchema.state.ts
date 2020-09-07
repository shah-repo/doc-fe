import { cloneDeep, filter, find, findIndex, includes, inRange, isUndefined, size, union } from "lodash";
import { action, get, observable, set } from "mobx";
import React from "react";
import { FBSchemaProps } from ".";
import { FBAutocompleteAsync, FBCheckboxGroup, FBEditorState, FBInputProps, FBInputType } from "..";
import { FBActionField } from "../FBActionField";
import { FBApproval } from "../FBApproval";
import { FBApprovalMatrixField } from "../FBApprovalMatrixField";
import { FBApprovals } from "../FBApprovals";
import { FBApprovers } from "../FBApprovers";
import { FBBlankTplForm } from "../FBBlankTplForm";
import { FBButton } from "../FBButton";
import { FBCheckbox } from "../FBCheckbox";
import { FBDatePicker } from "../FBDatePicker";
import { FBDocumentRevisions } from "../FBDocumentRevisions";
import { FBFileUpload } from "../FBFileUpload";
import { FBHelloSign } from "../FBHelloSign";
import { FBHyperlink } from "../FBHyperlink";
import { FBInstructionsDocument } from "../FBInstructionsDocument";
import { FBMediaAlbumField } from "../FBMediaAlbumField";
import { FBParagraph } from "../FBParagraph";
import { FBPOApprovalMatrix } from "../FBPOApprovalMatrix";
import { FBPOReceive } from "../FBPOReceive";
import { FBPurchaseOrder } from "../FBPurchaseOrder";
import { FBQuantityField } from "../FBQuantityField";
import { FBRadio } from "../FBRadio";
import { FBRadioGroup } from "../FBRadioGroup";
import { FBRequestApproval } from "../FBRequestApproval";
import { FBSchemaSelect } from "../FBSchemaSelect";
import { FBSection } from "../FBSection";
import { FBSelect } from "../FBSelect";
import { FBSelectDocument } from "../FBSelectDocument";
import { FBSelectRequirement } from "../FBSelectRequirement";
import { FBSubsection } from "../FBSubsection";
import { FBTask } from "../FBTask";
import { FBTestRequirement } from "../FBTestRequirement";
import { FBTextEditor } from "../FBTextEditor";
import { FBTextField } from "../FBTextField";
import { FBTimerField } from "../FBTimerField";

export class FBSchemaState {
  public static omitLabel: FBInputType[] = [
    "section",
    "subsection",
    "stepsection",
    "teststep",
    "purchaseorder",
    "task",
    "blanktplform",
  ];

  private static control: Partial<Record<FBInputType, React.FunctionComponent<any>>> = {
    section: FBSection,
    subsection: FBSubsection,
    stepsection: FBSection,
    teststep: FBSection,
    textfield: FBTextField,
    checkbox: FBCheckbox,
    checkboxgroup: FBCheckboxGroup,
    autocomplete: FBAutocompleteAsync,
    autocompleteasync: FBAutocompleteAsync,
    texteditor: FBTextEditor,
    datepicker: FBDatePicker,
    hyperlink: FBHyperlink,
    select: FBSelect,
    radio: FBRadio,
    radiogroup: FBRadioGroup,
    fileupload: FBFileUpload,
    blanktplform: FBBlankTplForm,
    schemaselect: FBSchemaSelect,
    paragraph: FBParagraph,
    quantity: FBQuantityField,
    timer: FBTimerField,
    purchaseorder: FBPurchaseOrder,
    poreceive: FBPOReceive,
    documentRevisions: FBDocumentRevisions,
    instructionsmediaupload: FBMediaAlbumField,
    evidencemediaupload: FBMediaAlbumField,
    testRequirement: FBTestRequirement,
    instructionsdocument: FBInstructionsDocument,
    selectdocument: FBSelectDocument,
    selectrequirement: FBSelectRequirement,
    checkpoint: FBButton,
    createlabel: FBButton,
    approval: FBApproval,
    requestapproval: FBRequestApproval,
    action: FBActionField,
    hellosign: FBHelloSign,
    approvalMatrix: FBApprovalMatrixField,
    poApprovalMatrix: FBPOApprovalMatrix,
    task: FBTask,
    approvers: FBApprovers,
    approvals: FBApprovals,
  };

  @observable public schema?: FBSchemaProps[];

  public constructor(schema?: FBSchemaProps[]) {
    this.schema = schema;
  }

  public static component = (controlProps: FBInputProps): React.ReactNode | undefined => {
    const { type, name, index } = controlProps;
    const schemaControl = FBSchemaState.control[type || ""];
    if (!schemaControl) {
      return;
    }
    return React.createElement(schemaControl, {
      key: `fb-control-${type}-${name}-${index}`,
      ...controlProps,
    });
  };

  @action public getSchema = (): FBSchemaProps[] => cloneDeep(get(this, "schema"));

  @action public getSchemaItem = (name?: string): FBSchemaProps | undefined => {
    if (!name) {
      return;
    }
    return find(this.getSchema(), { name });
  };

  @action public getSchemaItemAt = (index?: number): FBSchemaProps | undefined => {
    if (isUndefined(index) || !inRange(index, 0, this.schema?.length)) {
      return;
    }
    return this.schema && this.schema[index];
  };

  @action public setSchema = (schema?: FBSchemaProps[]) => {
    schema = (schema || []).map((schemaItem: FBSchemaProps, i, ro) => ({
      ...schemaItem,
      index: i,
      ...(includes(FBEditorState.pickStepIndex, schemaItem.type)) && {
        stepIndex: size(filter(ro.slice(0, i + 1), (step) =>
          includes(FBEditorState.pickStepIndex, step.type))),
      },
    }));
    set(this, "schema", schema);
  };

  @action public setSchemaItem = (schemaItem: FBSchemaProps) => {
    const schemaItemIndex = findIndex(this.getSchema(), { name: schemaItem.name });
    const schemaAt = this.getSchemaItemAt(schemaItemIndex);
    if (!schemaAt) {
      const schema = union(this.schema, [schemaItem]);
      this.setSchema(schema);
      return;
    }
    this.updateSchemaItem(schemaItem, schemaItemIndex);
  };

  @action public setSchemaItemAt = (schemaItem: FBSchemaProps | FBInputProps, index = 0) => {
    const schemaAt = this.getSchemaItemAt(index);
    if (schemaAt && schemaItem.name === schemaAt.name) {
      return this.updateSchemaItem(schemaItem, index);
    }
    const newSchema = this.schema?.slice(0) || [];
    newSchema?.splice(index, 0, schemaItem);
    this.setSchema(newSchema);
  };

  @action public updateSchemaItem = (schemaItem: FBSchemaProps, at: number) => {
    const newSchema = [...this.getSchema()];
    newSchema[at] = schemaItem;
    this.setSchema(newSchema);
  };

  @action public removeSchemaItem = (schemaItem?: FBSchemaProps) => {
    if (!schemaItem) {
      return;
    }
    const schema = filter(this.schema, (item) => item.name !== schemaItem.name);
    this.setSchema(schema);
  };

  @action public removeSchemaItemAt = (index: number | undefined) => {
    const schemaItem = this.getSchemaItemAt(index);
    if (isUndefined(schemaItem)) {
      return;
    }
    this.removeSchemaItem(schemaItem);
  };
}

export default FBSchemaState;
