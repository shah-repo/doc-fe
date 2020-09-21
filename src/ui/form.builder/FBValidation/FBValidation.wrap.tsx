import { Dictionary, get, isArray, isDate, isObject, join, map } from "lodash";
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
        case isArray(value): return value;
        case isDate(value): return (value as string);
        case isObject(value): return get(value, key);
        default: return value;
      }
    }

    function valueSplit(key: string, value: any): string {
      const ruleDelimiter = [":", ","];
      let rules = value ? key : "";
      if (isObject(value)) {
        map(value, (v, k) => {
          rules += `${ruleDelimiter.shift()}${valueByType(v, k)}`;
        });
      }
      return rules;
    }

    toStringRules = (validators: Dictionary<any>): string | undefined => {
      const rules = map(validators, (value, key) => `${valueSplit(key, value)}`);
      return join(rules, "|");
    };

    return Component({
      ...(props as T),
      toStringRules,
    });
  };

  return (props: T) => Comp(props);
};
