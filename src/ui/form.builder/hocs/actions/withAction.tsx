import { Dictionary, get, isUndefined, map, omit } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import FBButton from "../../components/inputs/FBButton";
import { FBFieldComponent } from "../../defaults/editor";
import FBActionStore from "../../stores/ui/FBActionStore";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
import FBStore from "../../stores/ui/FBStore";
import { FBActionProps } from "../../types/actions/action";
import { withFormik } from "../common/withFormik";

export const withAction = <T extends FBActionProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({ action, form, field, ...props }: T) => {
    const onClick = () => {
      let values = get(form, `values.${action.name || ""}`);
      const addition: Dictionary<string> = {};
      map(form?.values, (v, k) => {
        if (!isUndefined(k.split(".")[1])) {
          addition[k.split(".")[1]] = v;
        }
      });
      values = {
        ...values,
        ...addition,
      };
      FBActionStore.values[action.name || ""] = omit(values, [
        "send-email-action-supplier-field",
      ]);
      const rules: Dictionary<string> = {};
      const attributes: Dictionary<string> = {};

      map(action.indicators, (indicator) => {
        rules[indicator.name || ""] = indicator.rules || "";
        attributes[indicator.name || ""] =
          (indicator.label as string) ||
          indicator.placeholder ||
          indicator.name ||
          "";
      });

      const validator = new FBDynamicValidatorStore.Validator(values, rules);
      function passes() {
        FBActionStore.apiCall(action);
      }
      function fails() {
        const errors = validator.errors.all();
        const t: Dictionary<string> = {};
        map(errors, (v, k) => {
          t[`${action.name}.${k}`] = v;
        });
        FBDynamicValidatorStore.setHelperText(t);
      }
      validator.setAttributeNames(attributes);
      validator.checkAsync(passes, fails);
    };

    const afterChange = (fieldName: string, value: any, values: any) => {
      FBActionStore.values[action.name || ""] = get(
        values,
        action.name || "",
      );
    };

    const indicators = (action.indicators || []).map((indicator, index) => {
      const InputType = FBFieldComponent[indicator.type || ""];
      const docId = get(form, `values.${action.name}.${indicator.name}`);
      if (indicator.requiredDocId && isUndefined(docId)) {
        form?.setFieldValue(`${action.name}.${indicator.name}`, FBStore.docId);
      }
      return (
        <InputType
          {...FBStore.fieldMode}
          {...indicator}
          name={`${action.name}.${indicator.name}`}
          afterChange={afterChange}
          rules=""
          key={`${action.name}.${indicator.name}-${index}`}
        />
      );
    });

    const actionButton = (
      <FBButton
        label={action.actionLabel}
        onClick={onClick}
        {...FBStore.fieldMode}
      />
    );

    return Component({
      ...(props as T),
      indicators,
      actionButton,
    });
  };

  return observer(withFormik((props: T) => Comp(props)));
};
