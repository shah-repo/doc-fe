type FormField =
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

type ITemplateRuleItem = any;

interface ITemplateRules {
  [key: string]: ITemplateRuleItem; // ne treba ovo
}

interface ISchemaItem {
  type: FormField;
  name: string;
  rules: ITemplateRules;
  applicableOn?: APPLICABLE_FOR_ACTION[];
}

interface IFormTemplate {
  schema: ISchemaItem[];
}
export interface CompanyValidators {
  validateTemplateSchema: (formTemplate: IFormTemplate) => Promise<any>;
  validateInput: (params: IValidateInput) => Promise<any>;
  registerHelperCallback: (callback: () => IRemoteValidatorsHelper) => void;
  registerContextCallback: (callback: () => IRemoteValidatorsContext) => void;
  buildInfo: {[K: string]: string};
}

enum APPLICABLE_FOR_ACTION {
  ON_SUBMIT = "ON_SUBMIT",
  ON_CHANGE = "ON_CHANGE",
  ON_STATE_TO_IN_REVIEW = "ON_STATE_TO_IN_REVIEW",
}

export interface IRemoteValidatorsHelper {
  getDocumentRevById: (id: string) => Promise<any>;
}

interface IRemoteValidatorsContext {
  documentId: string | null;
  action: APPLICABLE_FOR_ACTION;
}

interface IValidateInput {
  action: APPLICABLE_FOR_ACTION;
  formTemplate: IFormTemplate;
  formInput: any;
  context: IRemoteValidatorsContext;
}
