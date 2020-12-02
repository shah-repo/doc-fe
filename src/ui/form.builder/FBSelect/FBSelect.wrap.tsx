import { MenuItem } from "@material-ui/core";
import { at, find, isUndefined, map } from "lodash";
import React from "react";
import { FB, FBSelectProps } from "..";
import Text from "../../components/Text";
import { withFBOption } from "../FBOption/FBOption.wrap";

export const withFBSelect = <T extends FBSelectProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    options,
    optionValueKey = "",
    optionLabelKey,
    defaultValue,
    menuItems,
    name,
    ...props
  }: T) => {
    const { formState } = FB.useStores();

    const formValue = formState?.getFieldValue(name);
    defaultValue = find(options as Record<any, any>[], (o) => o[optionValueKey] === formValue);
    isUndefined(menuItems) &&
      (menuItems = map(options as Record<any, any>[], (option, index) => {
        const [value, message] = at(option, [
          optionValueKey,
          optionLabelKey,
        ]);
        return (
          <MenuItem key={`fb-${value}-${index}`} {...{ value }}>
            <Text {...{ message }} tagName="em" />
          </MenuItem>
        );
      }));

    return Component({
      ...(props as T),
      menuItems,
      defaultValue,
      optionValueKey,
      optionLabelKey,
      options,
      name,
    });
  };
  return withFBOption((props: T) => Comp(props));
};
