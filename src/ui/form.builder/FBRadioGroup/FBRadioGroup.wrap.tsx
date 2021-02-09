import { FormControlLabel, Radio } from "@material-ui/core";
import { at, map } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBRadioGroupProps } from ".";
import { FB, FBOption } from "..";
import Text from "../../components/Text";
import { isTranslation } from "../../translations/types";
import { withFBOption } from "../FBOption/FBOption.wrap";

export const withFBRadioGroup = <T extends FBRadioGroupProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    options,
    optionValueKey = "",
    optionLabelKey = "",
    controls,
    disabled,
    name = "",
    isInputOwner,
    ...props
  }: T) => {
    const intl = useIntl();
    const { formState, workspaceState } = FB.useStores();

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;

    controls = map(options as FBOption[], (option, index) => {
      const [value, message] = at(option, [optionValueKey, optionLabelKey]);
      let attr = message;
      if (isTranslation(attr)) {
        attr = intl.formatMessage({ id: message });
      }
      formState?.setValidationAttributeName(value, attr);
      return (
        <FormControlLabel
          key={`fb-${value}-${index}`}
          control={<Radio {...{ disabled }} />}
          {...{ value }}
          label={<Text {...{ message }} />}
        />
      );
    });

    return Component({
      ...(props as T),
      controls,
      disabled,
      options,
    });
  };

  return withFBOption((props: T) => Comp(props));
};
