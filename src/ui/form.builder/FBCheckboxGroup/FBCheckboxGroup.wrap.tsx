import { Checkbox, FormControlLabel } from "@material-ui/core";
import { at, includes, map } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBCheckboxGroupProps } from ".";
import { FBOption } from "..";
import Text from "../../components/Text";
import { isTranslation } from "../../translations/types";
import { withFBOption } from "../FBOption/FBOption.wrap";
import { FB } from "../helpers";

export const withFBCheckboxGroup = <T extends FBCheckboxGroupProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onChange,
    options,
    optionValueKey = "",
    optionLabelKey = "",
    defaultValue,
    controls,
    disabled,
    name = "",
    isInputOwner,
    ...props
  }: T) => {

    const { formState, workspaceState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || defaultValue;
    const intl = useIntl();

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;

    controls = map(options as FBOption[], (option, index) => {
      const [value, message] = at(option, [optionValueKey, optionLabelKey]);
      const defaultChecked = includes(formValue, value);
      let attr = message;
      if (isTranslation(attr)) {
        attr = intl.formatMessage({ id: message });
      }
      formState?.setValidationAttributeName(value, attr);
      return (
        <FormControlLabel
          key={`${value}-${index}`}
          control={<Checkbox disabled={disabled || option.disabled} {...{ value, onChange, defaultChecked }} />}
          label={<Text {...{ message }} />}
        />
      );
    });

    return Component({
      ...(props as T),
      onChange,
      controls,
      disabled,
      name,
      options,
      optionValueKey,
      optionLabelKey,
      defaultValue,
    });
  };

  return withFBOption((props: T) => Comp(props));
};
