import _ from "lodash";
import React from "react";
import { FB, FBEditorPropertiesProps } from "..";

export const withFBEditorProperties = <T extends FBEditorPropertiesProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    onChange,
    ...props
  }: T) => {

    const { formState } = FB.useStores();

    onChange = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const [valueName, checked] = _.at(ev.target, ["value", "checked"]);
      // *NOTE: Mobile support until mobile switches to editor props
      formState?.setFieldValue(valueName, checked);
    };

    return Component({
      ...(props as T),
      onChange,
    });
  };
  return (props: T) => Comp(props);
};
