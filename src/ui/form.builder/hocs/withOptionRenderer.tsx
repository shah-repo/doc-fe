import _ from "lodash";
import React from "react";
import FBCheckbox from "../components/inputs/FBCheckbox";
import { FBGroupField } from "../defaults/editor";
import {
  FBFormDefaultProps,
  FBOptionRendererProps,
  Subtract,
} from "../types/common";
import { FBEditorElementType } from "../types/editor";
import { withLabelRenderer } from "./withLabelRenderer";

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
      const options = this.props.options || "";
      if (typeof options !== "string") {
        return;
      }
      const optionsArray = _.split(options!, "\n");
      if (includeOther) {
        optionsArray.push("form.builder.other");
      }
      return this.controlRenderer(optionsArray);
    };

    private controlRenderer = (optionsArray: string[]) => {
      const { name } = this.props;
      if (!name) {
        return;
      }
      const type = name.split("_").pop();
      const InputType = FBGroupField[type as string];
      return optionsArray.map((label, i) => (
        <InputType
          {...this.props}
          key={`fb.check.${name}.${i}`}
          name={type !== "radiogroup" ? `${name}_check_${i}` : name}
          gutter={false}
          label={label}
          includeNote={
            label === "form.builder.other" ? this.props.includeNote : false
          }
        />
      ));
    };
  }

  return withLabelRenderer(HOC);
}
