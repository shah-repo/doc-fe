import { map, template } from "lodash";
import { FB, FBActionOptionProps, FBAutocompleteAsyncConfig, FBEditorPropertiesOption, FBEditorPropertiesType, FBIconConfig, FBInputType, FBOption, FBPassType } from "..";
import { FBIconType } from "../FBIcon";
import { FBCurrencyOption } from "../FBPurchaseOrderTable";
import { FBSchemaProps } from "../FBSchema";
import actionOptions from "./actionOptions.json";
import additionalSchema from "./additionalSchema.json";
import approvalMatrixRoleSchema from "./approvalMatrixRoleSchema.json";
import aqlOptions from "./aqlOptions.json";
import autocompleteOptions from "./autocompleteOptions.json";
import closingTaskSchema from "./closingTaskSchema.json";
import currencyOptions from "./currencyOptions.json";
import editorProperties from "./editorProperties.json";
import editorPropertiesControl from "./editorPropertiesControl.json";
import eqMaintenanceOptions from "./eqMaintenanceOptions.json";
import icons from "./icons.json";
import passTypeOptions from "./passTypeOptions.json";
import requirementOptions from "./requirementOptions.json";
import taskSchema from "./taskSchema.json";
import testStepSchema from "./testStepSchema.json";
import unitsOptions from "./unitsOptions.json";
import yesNoOptions from "./yesNoOptions.json";

export class FBData {
  public static get testStepSchema(): FBSchemaProps[]  {
    const compiled = template(JSON.stringify(testStepSchema));
    return JSON.parse(compiled({ id: FB.uniqid })) as unknown as FBSchemaProps[];
  }

  public static get editorProperties(): Record<FBEditorPropertiesType, FBEditorPropertiesOption> {
    return editorProperties;
  }

  public static get editorPropertiesControl(): Record<FBInputType, FBEditorPropertiesType[]> {
    return editorPropertiesControl as Record<FBInputType, FBEditorPropertiesType[]>;
  }

  public static editorPropertiesByType(type: FBInputType): FBEditorPropertiesOption[] | undefined {
    const editorProps = FBData.editorPropertiesControl[type];
    if (!editorProps) { return; }
    return map(editorProps, (itm) => ({
      value: itm,
      ...FBData.editorProperties[itm],
      // :/
      ...(itm === "includeContext" && (type === "checkbox" || type === "radio")) && {
        text: "form.builder.include.note",
      },
    })) as FBEditorPropertiesOption[];
  }

  public static get autocompleteOptions(): FBAutocompleteAsyncConfig[] {
    return autocompleteOptions;
  }

  public static get unitsOptions(): FBOption[] {
    return unitsOptions;
  }

  public static get productUnitsOptions(): FBOption[] {
    const notAllowedItems = ["hours", "days", "months"];
    return unitsOptions.filter((item: {[key: string]: string}) => !notAllowedItems.includes(item.value));
  }

  public static get serviceUnitsOptions(): FBOption[] {
    const allowedItems = ["hours", "days", "months", "each"];
    return unitsOptions.filter((item: {[key: string]: string}) => allowedItems.includes(item.value));
  }

  public static get requirementOptions(): FBOption[] {
    return requirementOptions;
  }

  public static get currencyOptions(): FBCurrencyOption[] {
    return currencyOptions as FBCurrencyOption[];
  }

  public static additionalSchema(type: FBInputType): Partial<FBSchemaProps>[] {
    const compiled = template(JSON.stringify(additionalSchema));
    const parse = JSON.parse(compiled({ id: FB.uniqid }));
    return parse[type];
  }

  public static get actionOptions(): FBActionOptionProps[] {
    return actionOptions as FBActionOptionProps[];
  }

  public static get approvalMatrixRoleSchema(): FBSchemaProps[] {
    return approvalMatrixRoleSchema as FBSchemaProps[];
  }

  public static get taskSchema(): FBSchemaProps[] {
    return taskSchema as FBSchemaProps[];
  }

  public static get closingTaskSchema(): FBSchemaProps[] {
    return closingTaskSchema as FBSchemaProps[];
  }

  public static get passTypeOptions(): FBOption[] {
    const tplKeys: Record<string, string> = {};
    map(Object.values(FBPassType), (key, index) => {
      tplKeys[`value${index}`] = `${key}`;
    });
    const compiled = template(JSON.stringify(passTypeOptions));
    const parsed = JSON.parse(compiled(tplKeys));
    return parsed;
  }

  public static get yesNoOptions(): FBOption[] {
    return yesNoOptions as FBOption[];
  }

  public static get aqlOptions(): FBOption[] {
    return aqlOptions as FBOption[];
  }

  public static get eqMaintenanceFieldOptions(): FBOption[] {
    return eqMaintenanceOptions.fields as FBOption[];
  }

  public static get eqMaintenanceTypeOptions(): FBOption[] {
    return eqMaintenanceOptions.type as FBOption[];
  }

  public static icons(color?: string): Record<FBIconType, FBIconConfig[]> {
    const compiled = template(JSON.stringify(icons));
    return JSON.parse(compiled({ color }));
  }
}

export default FBData;
