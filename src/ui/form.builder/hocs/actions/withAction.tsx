import _ from "lodash";
import React from "react";
import FBButton from "../../components/inputs/FBButton";
import { FBFieldComponent } from "../../defaults/editor";
import FBActionStore from "../../stores/ui/FBActionStore";
import FBStore from "../../stores/ui/FBStore";
import { FBActionProps } from "../../types/actions/action";
import { withFormik } from "../common/withFormik";

export const withAction = <T extends FBActionProps>(
  Component: React.FunctionComponent<T>,
) => {
  const component = ({
    action,
    form,
    ...props
  }: T) => {

    const onClick = () => {
      const values = FBActionStore.values[action.name || ""];
      let isValid = true;
      _.map(action.indicators, (indicator) => {
        const valueByName = _.get(values, indicator.name || "");
        if (_.isUndefined(valueByName) && !indicator.requiredDocId) {
          form && form.setFieldError(`${action.name}.${indicator.name || ""}`, "Field is required");
          isValid = false;
        }
      });

      if (isValid) {
        FBActionStore.apiCall(action);
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

  return withFormik((props: T) => component(props));
};
