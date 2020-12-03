import React from "react";
import { FBRangeValue } from "../FBInspection/FBRange.types";
import { FBPassValueRange, FBTextFieldWithRangeProps } from "./FBTextFieldWithRange.types";

export const withFBTextFieldWithRange = <T extends FBTextFieldWithRangeProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    editorConfig,
    ...props
  }: T) => {
  // MARK: @config
    const { aql, fai, pass, range } = editorConfig;

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods
    const calculatePassValue = (passRange: FBPassValueRange): FBRangeValue | undefined => {
      if (passRange.type === "value") { return passRange.value; }
      if (!passRange.percentage) { return; }
      const { decrease, increase, value } = passRange.percentage;
      if (!decrease || !increase || !value ) { return; }
      const from = Number(value) * (1 - decrease / 100);
      const to = Number(value) * (1 + increase / 100);
      return { from, to };
    };

    const getRules = (): string => {
      if (!range) { return ""; }
      if (range.from && range.to) {
        return `between:${range?.from},${range?.to}`;
      }
      if (range.from && !range.to) {
        return `min:${range?.from}`;
      }
      if (!range.from && range.to) {
        return `max:${range?.to}`;
      }
      return "";
    };

    // MARK: @observer

    return Component({
      ...(props as T),
      aql,
      fai,
      pass: calculatePassValue(pass),
      range,
      rules: getRules(),
    });
  };

  Comp.displayName = "withFBTextFieldWithRange";
  return Comp;
};
