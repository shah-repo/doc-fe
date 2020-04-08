import _ from "lodash";
import { action, get, observable, set } from "mobx";
import React from "react";
import { FBSchemaProps } from ".";
import { FBCheckboxGroup, FBInputProps, FBInputType } from "..";
import { FBParagraph } from "../FBParagraph";
import { FBSection } from "../FBSection";
import { FBTextField } from "../FBTextField";

export class FBSchemaState {
  public static omitLabel: FBInputType[] = ["section", "subsection"];

  private static control: Partial<Record<FBInputType, React.FunctionComponent<any>>> = {
    section: FBSection,
    // subsection: FBSubsection,
    textfield: FBTextField,
    // checkbox: FBCheckbox,
    checkboxgroup: FBCheckboxGroup,
    // texteditor: FBTextEditor,
    // datepicker: FBDatePicker,
    // hyperlink: FBLink,
    // select: FBSelectField,
    // radio: FBRadio,
    // radiogroup: FBRadioGroup,
    // fileupload: FBFileUpload,
    // autocomplete: FBAutocomplete,
    // autocompleteasync: FBAutocompleteAsync,
    // schemaselect: FBSchemaSelect,
    paragraph: FBParagraph,
  };

  public controlProps: FBInputProps | undefined;
  public type: FBInputType | undefined;
  public index: number | undefined;

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

  @action public getSchema = (): FBSchemaProps[] => get(this, "schema");

  @action public getSchemaItem = (name: string): FBSchemaProps | undefined =>
    _.find(this.getSchema(), { name });

  @action public getSchemaItemAt = (index?: number): FBSchemaProps | undefined => {
    if (_.isUndefined(index)) {
      return;
    }
    return _.get(this.getSchema(), index);
  };

  @action public setSchema = (schema?: FBSchemaProps[]) => {
    schema && schema.map((o, i) => o.index = i);
    set(this, "schema", schema);
  };

  @action public setSchemaItem = (schemaItem: FBSchemaProps) => {
    const schemaItemIndex = _.findIndex(this.getSchema(), { name: schemaItem.name });
    if (!_.isUndefined(this.getSchemaItemAt(schemaItemIndex))) {
      this.updateSchemaItem(schemaItem, schemaItemIndex);
    } else {
      const schema = _.union(this.schema, [schemaItem]);
      this.setSchema(schema);
    }
  };

  @action public setSchemaItemAt = (schemaItem: FBSchemaProps, index?: number) => {
    if (_.isUndefined(index)) {
      return;
    }
    const position = index || _.size(this.schema);
    const newSchema = this.schema?.slice(0);
    if (!newSchema) {
      return;
    }
    newSchema.splice(position, 0, schemaItem);
    this.setSchema(newSchema);
  };

  @action public updateSchemaItem = (schemaItem: FBSchemaProps, at: number) => {
    const newSchema = [...this.getSchema()];
    newSchema[at] = schemaItem;
    this.setSchema(newSchema);
  };

  @action public removeSchemaItem = (schemaItem: FBSchemaProps) => {
    const schema = _.filter(this.schema, (item) => item.name !== schemaItem.name);
    this.setSchema(schema);
  };

  @action public removeSchemaItemAt = (index: number | undefined) => {
    const schemaItem = this.getSchemaItemAt(index);
    if (_.isUndefined(schemaItem)) {
      return;
    }
    this.removeSchemaItem(schemaItem);
  };
}

export default FBSchemaState;
