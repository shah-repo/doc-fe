import Base64 from "Base64";
import _, { Dictionary }  from "lodash";
import { action, computed, observable } from "mobx";
import { FBValidatorConfigProps } from "../../types/validation/validatorDialog";

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
  public validatorName?: string;
  public errorMessage: string = "";
  @observable public liveCode: string = this.originCode({ vars: "", code: ""});
    private originCode = _.template(`
    (value, req, attribute) => {
      <%= vars %>
      try {
        <%= code %>
        return true;
      }
      catch(error) {
        alert(error);
      }
    }
  `);
  private fieldNames: string[] = [];

  @action public setVariable = (fieldName: string) => {
    this.fieldNames = _.concat(this.fieldNames, fieldName);
    this.generateVariables();
  }

  @action public removeVariable = (fieldName: string) => {
    this.fieldNames = _.pull(this.fieldNames, fieldName);
    this.generateVariables();
  }

  @action public setLiveCode = (code: string) => {
      if (this.liveCode === code) {
          return;
      }
      this.liveCode = code;
  }

  @action public clearLiveCode = () => {
    //   this.setLiveCode(this.originCode);
    //   this.validatorName = undefined;
  }

  @action public setValidatorName = (name: string) => {
      this.validatorName = name;
  }

  @action public setErrorMessage = (message: string) => {
      this.errorMessage = message;
  }

  @action private generateVariables = () => {
    let varsStr = "\n";
    const varsObj: Dictionary<string> = {};

    _.map(this.fieldNames, (variable, index) => {
      varsStr += _.padStart(`<%= var${index} %>`, 17);
      varsStr += "\n";

      // Set obj for tpl values
      let varName = _.dropRight(_.split(variable, "_")).join(" ");
      varName = _.camelCase(varName);

      varsObj[`var${index}`] = `var ${varName} = req["${variable}"];`;
    });

    // Extract the code. This approach executes faster then the regex between.
    const start = "try {\n";
    const end = "return true;";
    let code = this.liveCode.split(start)[1].split(end)[0].replace("\n", "");
    code = _.trimStart(code);

    const tplStr = this.originCode({ vars: varsStr, code });
    const tpl = _.template(tplStr);
    this.setLiveCode(tpl(varsObj));
  }
}

const FBDynamicValidatorStore = new FormBuilderDynamicValidatorStore();
export default FBDynamicValidatorStore;
