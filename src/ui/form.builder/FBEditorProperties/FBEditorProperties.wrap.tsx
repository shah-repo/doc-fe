import { at, map } from "lodash";
import React from "react";
import { FB, FBData, FBEditorPropertiesDefaultValue, FBEditorPropertiesProps } from "..";

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

    // We need to refactor this. All disabled props will have to be handled from editor properties
    // reviseDisabled, outputDisabled ...
    // Refactoring will require predefined schemes migration as well
    // This is a hack for default checked props
    const defaultChecked = FBEditorPropertiesDefaultValue[type ?? ""];
    map(defaultChecked, (key) => {
      formState?.setFieldValue(key, true);
    });

    return Component({
      ...(props as T),
      onChange,
      options,
      type,
    });
  };
  return (props: T) => Comp(props);
};
