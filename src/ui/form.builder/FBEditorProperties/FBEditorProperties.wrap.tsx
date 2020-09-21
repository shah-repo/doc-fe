import { at } from "lodash";
import React from "react";
import { FB, FBData, FBEditorPropertiesProps } from "..";

export const withFBEditorProperties = <T extends FBEditorPropertiesProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    onChange,
    options,
    type,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    type && (options = FBData.editorPropertiesByType(type));

    onChange = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const [valueName, checked] = at(ev.target, ["value", "checked"]);
      // *NOTE: Mobile support until mobile switches to editor props
      formState?.setFieldValue(valueName, checked);
    };

    return Component({
      ...(props as T),
      onChange,
      options,
      type,
    });
  };
  return (props: T) => Comp(props);
};
