import { cloneDeep, filter, find, findIndex, includes, inRange, isUndefined, size, union, unionBy } from "lodash";
import { action, get, observable, set } from "mobx";
import React from "react";
import { FBSchemaProps } from ".";
import {
  FBActionField,
  FBApproval,
  FBAutocompleteAsync,
  FBCheckboxGroup,
  FBEditorState,
  FBInputProps,
  FBInputType,
  FBProcedure,
  FBProcedureDiff,
} from "..";
import { FBApprovalMatrixField } from "../FBApprovalMatrixField";
import { FBApprovals } from "../FBApprovals";
import { FBApprovers } from "../FBApprovers";
import { FBBlankTplForm } from "../FBBlankTplForm";
import { FBButton } from "../FBButton";
import { FBCheckbox } from "../FBCheckbox";
import { FBDatePicker } from "../FBDatePicker";
import { FBDocumentRevisions } from "../FBDocumentRevisions";
import { FBEBPart } from "../FBEBPart";
import { FBEQMaintenance } from "../FBEQMaintenance";
import { FBFileUpload } from "../FBFileUpload";
import { FBHelloSign } from "../FBHelloSign";
import { FBHyperlink } from "../FBHyperlink";
import { FBInlineApproval } from "../FBInlineApproval";
import { FBInstructionsDocument } from "../FBInstructionsDocument";
import FBLHRStep from "../FBLHRStep/FBLHRStep";
import { FBMediaAlbumField } from "../FBMediaAlbumField";
import { FBParagraph } from "../FBParagraph";
import { FBParts } from "../FBParts";
import { FBPOApprovalMatrix } from "../FBPOApprovalMatrix";
import { FBPOReceive } from "../FBPOReceive";
import { FBPurchaseOrder } from "../FBPurchaseOrder";
import { FBQuantityField } from "../FBQuantityField";
import { FBRadio } from "../FBRadio";
import { FBRadioGroup } from "../FBRadioGroup";
import { FBRequestApproval } from "../FBRequestApproval";
import FBSchemaSelect from "../FBSchemaSelect/FBSchemaSelect";
import { FBSection } from "../FBSection";
import { FBSelect } from "../FBSelect";
import { FBSelectDocument } from "../FBSelectDocument";
import { FBSelectRequirement } from "../FBSelectRequirement";
import { FBSubsection } from "../FBSubsection";
import FBSupplier from "../FBSupplier/FBSupplier";
import { FBTask } from "../FBTask";
import { FBTestRequirement } from "../FBTestRequirement";
import FBTextEditor from "../FBTextEditor/FBTextEditor";
import { FBTextField } from "../FBTextField";
import { FBTextFieldWithRange } from "../FBTextFieldWithRange";
import { FBTimerField } from "../FBTimerField";
import FBMPIProcedure from "../FBMPIProcedure/FBMPIProcedure";

export class FBSchemaState {
  public static omitLabel: FBInputType[] = [
    "section",
    "subsection",
    "stepsection",
    "teststep",
    "purchaseorder",
    "task",
    "blanktplform",
    "approvals",
    "eqmaintenance",
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
    inlineapproval: FBInlineApproval,
    requestapproval: FBRequestApproval,
    action: FBActionField,
    hellosign: FBHelloSign,
    approvalMatrix: FBApprovalMatrixField,
    poApprovalMatrix: FBPOApprovalMatrix,
    task: FBTask,
    approvers: FBApprovers,
    approvals: FBApprovals,
    procedure: FBProcedure,
    mpiprocedure: FBMPIProcedure,
    parts: FBParts,
    procedurediff: FBProcedureDiff,
    ebpart: FBEBPart,
    eqmaintenance: FBEQMaintenance,
    textfieldwithrange: FBTextFieldWithRange,
    supplier: FBSupplier,
    lhrstep: FBLHRStep,
  };

  @observable public schema?: FBSchemaProps[];
  public validationSchema?: Partial<FBSchemaProps>[];

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

  public setValidationSchemaItem = (item: Partial<FBSchemaProps>) => {
    if (!item.name || !item.label) { return; }
    set(this, "validationSchema", unionBy(this.validationSchema || [], [item], "name"));
  };

  public getValidationSchema = () => cloneDeep(get(this, "validationSchema"));

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
          !step.deleted && includes(FBEditorState.pickStepIndex, step.type))),
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
    this.setValidationSchemaItem(schemaItem);
  };

  @action public setSchemaItemAt = (schemaItem: FBSchemaProps | FBInputProps, index = 0) => {
    const schemaAt = this.getSchemaItemAt(index);
    if (schemaAt && schemaItem.name === schemaAt.name) {
      return this.updateSchemaItem(schemaItem, index);
    }
    const newSchema = this.schema?.slice(0) || [];
    newSchema?.splice(index, 0, schemaItem);
    this.setSchema(newSchema);
    this.setValidationSchemaItem(schemaItem);
  };

  @action public updateSchemaItem = (schemaItem: FBSchemaProps, at: number) => {
    const newSchema = [...this.getSchema()];
    newSchema[at] = schemaItem;
    this.setSchema(newSchema);
    this.setValidationSchemaItem(schemaItem);
  };

  @action public removeSchemaItem = (schemaItem?: FBSchemaProps) => {
    if (!schemaItem) {
      return;
    }
    const schema = filter(this.schema, (item) => item.name !== schemaItem.name);
    this.setSchema(schema);
    const validationSchema = filter(this.schema, (item) => item.name !== schemaItem.name);
    this.validationSchema = validationSchema;
  };

  @action public removeSchemaItemAt = (index: number | undefined) => {
    const schemaItem = this.getSchemaItemAt(index);
    if (isUndefined(schemaItem)) {
      return;
    }
    this.removeSchemaItem(schemaItem);
  };

  public getItemsByType = (type?: FBInputType): FBSchemaProps[] => {
    if (!type) { return []; }
    return filter(this.getSchema(), (item) =>
      !item.deleted && item.type === type
    );
  };

  public getNamesByType = (type?: FBInputType): string[] => {
    if (!type) { return []; }
    return this.getSchema().reduce((names: string[], item) => {
      if (item.deleted || item.type !== type) { return names; }
      if (item.name) {
        names.push(item.name);
      }
      return names;
    }, []);
  };
}

export default FBSchemaState;
