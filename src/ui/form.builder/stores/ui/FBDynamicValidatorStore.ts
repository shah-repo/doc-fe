import Base64 from "Base64";
import _, { Dictionary } from "lodash";
import { action, computed, observable } from "mobx";
import Validator from "validatorjs";
import {
  FBValidatorConfigProps,
  FBValidatorTemplate,
} from "../../types/validation/validatorDialog";
import FBStore from "./FBStore";
import FBValidatorStore from "./FBValidatorStore";

export class FormBuilderDynamicValidatorStore {
  @computed get dynamicValidator(): FBValidatorConfigProps | undefined {
    if (_.isUndefined(this.validatorName)) {
      return;
    }
    return {
      name: this.validatorName,
      errorMessage: this.errorMessage,
      fn: Base64.btoa(this.liveCode),
    };
  }
  public originCode = _.template(`
    (value, req, attribute) => {
      <%= interpolation %>
      try {
        <%= code %>
        return true;
      }
      catch(error) {
        return false;
      }
    }
  `);
  public validatorName?: string;
  @observable public errorMessage: string = "";
  @observable public liveCode: string = this.originCode({
    interpolation: "",
    code: "",
  });
  @observable public helperText: Dictionary<string> = {};
  private fieldNames: string[] = [];

  @action public setVariable = (fieldName: string) => {
    this.fieldNames = _.concat(this.fieldNames, fieldName);
    this.generateTemplate();
  }

  @action public removeVariable = (fieldName: string) => {
    this.fieldNames = _.pull(this.fieldNames, fieldName);
    this.generateTemplate();
  }

  @action public setLiveCode = (code: string) => {
    if (this.liveCode === code) {
      return;
    }
    this.liveCode = code;
  }

  @action public clearLiveCode = () => {
    this.setLiveCode(this.originCode({
      interpolation: "",
      code: "",
    }));
  }

  @action public setValidatorName = (name: string) => {
    this.reset();
    this.validatorName = name;
  }

  @action public setErrorMessage = (message: string) => {
    this.errorMessage = message;
  }

  @action public reset = () => {
    this.validatorName = undefined;
    this.errorMessage = "";
    this.clearLiveCode();
    this.fieldNames = [];
  }

  @action public validate = () => {
    if (FBStore.mode !== "form") {
      return;
    }

    // Clear helper text
    this.helperText = {};

    // UI validator
    FBValidatorStore.uiValidate();

    // Dynamic validator
    const rules = this.generateRules();

    const validator = new Validator(FBStore.getValidationValues(), rules);

    if (validator.fails()) {
      const errors = validator.errors.all();
      _.map(errors, (v, k) => {
        this.setHelperText(k, _.join(v, "\n"));
      });
    }
  }

  @action public registerValidators = () => {
    // Empty validator
    Validator.register(
      "",
      () => {
        return true;
      },
      "",
    );

    _.map(FBStore.getSchema(), (schemaItem) => {
      const { customValidator } = schemaItem;

      if (!_.isUndefined(customValidator)) {
        // const tpl = _.template(`<% ${Base64.atob(customValidator.fn)} %>`);

        let customValFn = () => true;
        try {
          // tslint:disable-next-line: no-eval
          customValFn = eval(Base64.atob(customValidator!.fn));
        } catch (error) {
          alert("An error occurred in validator function body: " + error);
        }

        Validator.register(
          customValidator.name,
          customValFn,
          customValidator.errorMessage || "",
        );
      }
    });
  }

  @action public getHelperText = (fieldName: string): string | undefined => {
    return _.get(this.helperText, fieldName);
  }

  @action public setHelperText = (fieldName: string, text: string) => {
    this.helperText = {
      ...this.helperText,
      [fieldName]: text,
    };
  }

  @action private generateRules = (): Dictionary<string> => {
    const rules = {};
    _.map(FBStore.getSchema(), (schemaItem) => {
      const { customValidator, name } = schemaItem;
      if (_.isUndefined(name)) {
        return;
      }

      rules[name] = "";
      !_.isUndefined(customValidator) &&
        (rules[name] = [
          { [customValidator.name]: FBStore.getValidationValues() },
        ]);
    });
    return rules;
  }

  @action private generateVariables = (): FBValidatorTemplate => {
    let interpolation = "\n";
    const values: Dictionary<string> = {};

    _.map(this.fieldNames, (variable, index) => {
      interpolation += `${_.padStart(`<%= var${index} %>`, 17)}\n`;

      // Set obj for tpl values
      let varName = _.dropRight(_.split(variable, "-")).join(" ");
      varName = _.camelCase(varName);
      const isValueVar = _.includes(variable, "<-val->");
      const varValue = isValueVar ? `"${variable}"` : `req["${variable}"]`;
      values[`var${index}`] = `var ${varName} = ${varValue};`;
    });

    return { interpolation, values };
  }

  @action private liveCodeExtraction = (): string => {
    // Extract the code. This approach executes faster then the regex 'between'.
    const start = "try {\n";
    const end = "return true;";
    const code = this.liveCode
      .split(start)[1]
      .split(end)[0]
      .replace("\n", "");
    return _.trimStart(code);
  }

  @action private generateTemplate = () => {
    const { interpolation, values } = this.generateVariables();
    const code = this.liveCodeExtraction();
    const tplStr = this.originCode({ interpolation, code });
    const tpl = _.template(tplStr);
    this.setLiveCode(tpl(values));
  }
}

const FBDynamicValidatorStore = new FormBuilderDynamicValidatorStore();
export default FBDynamicValidatorStore;
