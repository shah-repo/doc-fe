import Base64 from "Base64";
import { camelCase, concat, Dictionary, dropRight, get, includes, isUndefined, join, map, padStart, pull, split, template, toString, trimStart } from "lodash";
import { action, computed, observable, set } from "mobx";
import Validator from "validatorjs";
import { FBSchemaProps } from "../..";
import { toastError } from "../../../components/notifications";
import { DATA_HELPER_CALLBACK_NAME } from "../../../remoteValidators/interfaces";
import { FBValidatorConfigProps, FBValidatorTemplate } from "../../types/validation/validatorDialog";
import FBStore from "./FBStore";
import FBValidatorStore from "./FBValidatorStore";

export class FormBuilderDynamicValidatorStore {
  @computed get Validator(): any {
    return get(window, "EnlilRemoteValidators.validator");
  }
  @computed get dynamicValidator(): FBValidatorConfigProps | undefined {
    if (isUndefined(this.validatorName)) {
      return;
    }
    return {
      name: this.validatorName,
      errorMessage: this.errorMessage,
      fn: Base64.btoa(this.liveCode),
    };
  }
  public originCode = template(`
    // Available Variables:

    // value: any
    // formInput: {
    //   [key: string]: any,
    // }
    // attribute: string
    // passes: (valid: boolean, message?: string) => void
    // dataHelper: {
    //   getDocumentRevById: async (id: string) => DocumentRevision,
    // },
    // context: {
    //   documentId: string,
    // },

    (async function(value, req, attribute, dataHelper, context) {
      try {
        <%= interpolation %>
        <%= code %>
        return true;
      }
      catch(error) {
        return false;
      }
    })
  `);
  public validatorName?: string;
  @observable public errorMessage = "";
  @observable public liveCode: string = this.originCode({
    interpolation: "",
    code: "",
  });
  @observable public helperText: Dictionary<string> = {};
  private fieldNames: string[] = [];

  @action public setDynamicValidator = (
    customValidator: FBValidatorConfigProps | undefined,
  ) => {
    if (isUndefined(customValidator)) {
      return;
    }
    this.setLiveCode(Base64.atob(customValidator.fn));
    this.validatorName = customValidator.name;
    this.errorMessage = customValidator.errorMessage || "";
  };

  @action public setVariable = (fieldName: string) => {
    this.fieldNames = concat(this.fieldNames, fieldName);
    this.generateTemplate();
  };

  @action public removeVariable = (fieldName: string) => {
    this.fieldNames = pull(this.fieldNames, fieldName);
    this.generateTemplate();
  };

  @action public setLiveCode = (code: string) => {
    if (this.liveCode === code) {
      return;
    }
    this.liveCode = code;
  };

  @action public clearLiveCode = () => {
    this.setLiveCode(
      this.originCode({
        interpolation: "",
        code: "",
      }),
    );
  };

  @action public setValidatorName = (name: string) => {
    this.reset();
    this.validatorName = name;
  };

  @action public setErrorMessage = (message: string) => {
    this.errorMessage = message;
  };

  @action public reset = () => {
    this.validatorName = undefined;
    this.errorMessage = "";
    this.clearLiveCode();
    this.fieldNames = [];
    FBValidatorStore.formValues = {};
  };

  @action public validate = () => {
    if (isUndefined(this.Validator)) {
      return;
    }

    // Clear helper text
    set(this, "helperText", {});

    const rules = FBValidatorStore.getSchemaReleasedRules();
    const values = {};
    map(FBStore.getValues(), (v, k) => {
      values[k] = toString(v);
    });
    const validator = new this.Validator(values, rules);

    function passes() { return null; }
    function fails() {
      const errors = validator.errors.all();
      FBDynamicValidatorStore.setHelperText(errors);
    }
    validator.setAttributeNames(FBStore.getValidationAttribute());
    validator.checkAsync(passes, fails);
  };

  @action public setHelperText = (
    errors: Validator.ValidationErrors | Dictionary<string>,
  ) => {
    map(errors, (v, k) => {
      set(this.helperText, k, join(v, "\n"));
    });
  };

  @action public getHelperText = (fieldName: string): string | undefined => get(this.helperText, fieldName);

  @action public registerValidators = (schema: FBSchemaProps[] = [], validator: any) => {
    if (isUndefined(this.Validator)) {
      return;
    }

    map(schema, (schemaItem) => {
      const { customValidator } = schemaItem;

      if (!isUndefined(customValidator)) {
        // const tpl = template(`<% ${Base64.atob(customValidator.fn)} %>`);

        // eslint-disable-next-line @typescript-eslint/require-await
        let customValFn = async (...args) => true;
        try {
          // eslint-disable-next-line no-eval
          customValFn = eval(Base64.atob(customValidator.fn));
        } catch (error) {
          toastError("An error occurred in validator function body: " + error);
        }

        validator.registerAsyncImplicit(
          customValidator.name,
          async function f(this: any, value, input, attribute, passes) {
            try {
              const dataHelper = this.validator.constructor[
                DATA_HELPER_CALLBACK_NAME
              ]();
              // const context = (this as any).validator.context;
              const context = {
                documentId: FBStore.docId,
              };
              const passed = await customValFn(
                value,
                this.validator.input,
                attribute,
                dataHelper,
                context,
              );
              passes(passed);
            } catch (error) {
              passes(false);
            }
          },
          customValidator.errorMessage || "",
        );
      }
    });
  };

  @action private generateVariables = (): FBValidatorTemplate => {
    let interpolation = "\n";
    const values: Dictionary<string> = {};

    map(this.fieldNames, (variable, index) => {
      interpolation += `${padStart(`<%= var${index} %>`, 17)}\n`;

      // Set obj for tpl values
      let varName = dropRight(split(variable, "-")).join(" ");
      varName = camelCase(varName);
      const isValueVar = includes(variable, "<-val->");
      const varValue = isValueVar ? `"${variable}"` : `req["${variable}"]`;
      values[`var${index}`] = `var ${varName} = ${varValue};`;
    });

    return { interpolation, values };
  };

  @action private liveCodeExtraction = (): string => {
    // Extract the code. This approach executes faster then the regex 'between'.
    const start = "try {\n";
    const end = "return true;";
    const code = this.liveCode
      .split(start)[1]
      .split(end)[0]
      .replace("\n", "");
    return trimStart(code);
  };

  @action private generateTemplate = () => {
    const { interpolation, values } = this.generateVariables();
    const code = this.liveCodeExtraction();
    const tplStr = this.originCode({ interpolation, code });
    const tpl = template(tplStr);
    this.setLiveCode(tpl(values));
  };
}

const FBDynamicValidatorStore = new FormBuilderDynamicValidatorStore();
export default FBDynamicValidatorStore;
