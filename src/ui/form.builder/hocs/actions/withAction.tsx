import _, { Dictionary } from "lodash";
import React from "react";
import FBButton from "../../components/inputs/FBButton";
import FBActionStore from "../../stores/ui/FBActionStore";
import FBStore from "../../stores/ui/FBStore";
import { FBActionProps } from "../../types/actions/action";
import { withFormik } from "../common/withFormik";
import { FBFieldComponent } from "../../defaults/editor";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";

export const withAction = <T extends FBActionProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    action,
    form,
    field,
    ...props
  }: T) => {

    const onClick = () => {
      const values = _.get(form, `values.${action.name || ""}`);
      const rules: Dictionary<string> = {};
      const attributes: Dictionary<string> = {};

      _.map(action.indicators, (indicator) => {
        rules[indicator.name || ''] = indicator.rules || "";
        attributes[indicator.name || ''] = indicator.label as string || indicator.placeholder || indicator.name || "";
      });

      const errors = FBValidatorStore.validate(values, rules, attributes);

      if (_.isEmpty(errors)) {
        FBActionStore.apiCall(action);
      } else {
        _.map(errors, (v, k) => {
          form && form.setFieldError(`${action.name}.${k}`, v.join("\n"));
        });
      }
    };

    const afterChange = (fieldName: string, value: any, values: any) => {
      FBActionStore.values[action.name || ""] = _.get(values, action.name || "");
    };

    const indicators = _.map(action.indicators, (indicator) => {
      const InputType = FBFieldComponent[indicator.type || ""];
      const docId = _.get(form, `values.id`);
      const formId = _.get(form!.values, `${action.name}.${indicator.name}`);
      if (indicator.requiredDocId && !_.isUndefined(docId) && _.isUndefined(formId)) {
        form!.setFieldValue(`${action.name}.${indicator.name}`, docId);
      }
      return (
        <InputType
          {...FBStore.fieldMode}
          {...indicator}
          name={`${action.name}.${indicator.name}`}
          afterChange={afterChange}
          rules=""
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

  return withFormik((props: T) => Comp(props));
};
