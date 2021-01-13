import React from "react";
import { FBPassValueRange, FBRangeValue, FBTextFieldWithRangeProps } from "..";

export const withFBTextFieldWithRange = <T extends FBTextFieldWithRangeProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    editorConfig,
    includeInFaiInspection,
    ...props
  }: T) => {
    // MARK: @config
    const { aql, pass, range, criticalToQuality } = editorConfig;
    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods
    const calculatePassValue = (passRange?: FBPassValueRange): FBRangeValue | undefined => {
      if (!passRange) { return; }
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
      criticalToQuality,
      includeInFaiInspection,
      pass: calculatePassValue(pass),
      range,
      rules: getRules(),
    });
  };

  Comp.displayName = "withFBTextFieldWithRange";
  return Comp;
};
