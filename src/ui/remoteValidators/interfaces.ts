export type FormField =
  | "textfield"
  | "checkbox"
  | "checkboxgroup"
  | "section"
  | "subsection"
  | "datepicker"
  | "texteditor"
  | "select"
  | "radio"
  | "radiogroup"
  | "autocomplete"
  | "hyperlink"
  | "fileupload"
  | "validator"
  | "schemaSelect";

export const DATA_HELPER_CALLBACK_NAME = "DataHelperCallback";
export const DATA_CONTEXT_CALLBACK_NAME = "DataContextCallback";

export interface ValidationResult {
  errors?: object;
  valid: boolean;
}

export type ITemplateRuleItem = any;
export interface ITemplateRules {
  [key: string]: ITemplateRuleItem; // ne treba ovo
}

export interface ISchemaItem {
  type: FormField;
  name: string;
  rules: ITemplateRules;
  applicableOn?: APPLICABLE_FOR_ACTION[];
}

export interface IFormInput {
  [key: string]: string | number | null | boolean;
}

export interface IFormTemplate {
  schema: ISchemaItem[];
}
export interface CompanyValidators {
  validateTemplateSchema: (formTemplate: IFormTemplate) => Promise<any>;
  validateInput: (params: IValidateInput) => Promise<any>;
  registerHelperCallback: (callback: () => IRemoteValidatorsHelper) => void;
  registerContextCallback: (callback: () => IRemoteValidatorsContext) => void;
}

export enum APPLICABLE_FOR_ACTION {
  ON_SUBMIT = "ON_SUBMIT",
  ON_CHANGE = "ON_CHANGE",
  ON_STATE_TO_IN_REVIEW = "ON_STATE_TO_IN_REVIEW",
}

export interface IRemoteValidatorsHelper {
  getDocumentRevById: (id: string) => Promise<any>;
}

export interface IRemoteValidatorsContext {
  documentId: string | null;
  action: APPLICABLE_FOR_ACTION;
}

export interface IValidateTemplate {
  action: APPLICABLE_FOR_ACTION;
  formTemplate: IFormTemplate;
  formInput: IFormInput;
}

export interface IValidateInput {
  action: APPLICABLE_FOR_ACTION;
  formTemplate: IFormTemplate;
  formInput: any;
  context: IRemoteValidatorsContext;
}

export interface IDocRev {
  id: string;
  status: string;
  name: string;
  document: {
    docId: string;
    documentType: {
      documentTypeAcronym: string;
    };
  };
}

export interface FormInput { [key: string]: any }
