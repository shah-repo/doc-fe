import _, { Dictionary } from "lodash";
import React from "react";
import { FBValidationProps } from ".";

export const withFBValidation = <T extends FBValidationProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    toStringRules,
    ...props
  }: T) => {

    function valueByType(value: any, key: string): any {
      switch (true) {
        case _.isArray(value): return value;
        case _.isDate(value): return (value as string);
        case _.isObject(value): return _.get(value, key);
        default: return value;
      }
    }

    function valueSplit(key: string, value: any): string {
      const ruleDelimiter = [":", ","];
      let rules = value ? key : "";
      if (_.isObject(value)) {
        _.map(value, (v, k) => {
          rules += `${ruleDelimiter.shift()}${valueByType(v, k)}`;
        });
      }
      return rules;
    }

    toStringRules = (validators: Dictionary<any>): string | undefined => {
      const rules = _.map(validators, (value, key) => `${valueSplit(key, value)}`);
      return _.join(rules, "|");
    };

    return Component({
      ...(props as T),
      toStringRules,
    });
  };

  return (props: T) => Comp(props);
};
