import _ from "lodash";
import React from "react";
import { SelectOption } from "../../components/forms/fields/Select";
import { FBGroupField } from "../defaults/editor";
import {
  FBFormDefaultProps,
  FBOptionRendererProps,
  Subtract,
} from "../types/common";
import { withLabelRenderer } from "./withLabelRenderer";

function isArray(value: any) {
  return value && typeof value === "object" && value.constructor === Array;
}

function isString(value: any) {
  return typeof value === "string" || value instanceof String;
}

export function withOptionRenderer<T extends FBFormDefaultProps>(
  Component: React.ComponentType<T>,
) {
  class HOC extends React.Component<Subtract<T, FBOptionRendererProps>> {
    public render() {
      return (
        <Component
          optionsRenderer={this.optionRenderer()}
          {...(this.props as T)}
        />
      );
    }

    private optionRenderer = () => {
      const { includeOther } = this.props;
      let options = this.props.options || "";
      if (options && isArray(options) && isString(options[0])) {
        options = _.join(options, "\n");
      }

      if (typeof options !== "string") {
        return this.controlRenderer(options as SelectOption[]);
      }

      const optionsArray = _.split(options!, "\n");
      if (includeOther) {
        optionsArray.push("form.builder.other");
      }

      const optionsArrayObject: SelectOption[] = optionsArray.map((o, i) => {
        return { value: i, text: o } as SelectOption;
      });
      return this.controlRenderer(optionsArrayObject);
    }

    private controlRenderer = (optionsArray: SelectOption[]) => {
      const { name, type } = this.props;
      if (!name || !type) {
        return;
      }

      const InputType = FBGroupField[type as string];

      return optionsArray.map((option) => (
        <InputType
          {...this.props}
          key={`fb.check.${name}.${option.value}`}
          name={type !== "radiogroup" ? `${name}:${option.value}` : name}
          gutter={false}
          label={option.text}
          includeNote={
            option.text === "form.builder.other" ? this.props.includeNote : false
          }
          isGroup={true}
        />
      ));
    }
  }

  return withLabelRenderer(HOC);
}
