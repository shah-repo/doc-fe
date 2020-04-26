import { Checkbox, FormControlLabel } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { FBCheckboxGroupProps } from ".";
import { FBOption } from "..";
import Text from "../../components/Text";
import { withFBOption } from "../FBOption/FBOption.wrap";
import { FB } from "../helpers";

export const withFBCheckboxGroup = <T extends FBCheckboxGroupProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    options,
    optionValueKey,
    optionLabelKey,
    controls,
    onChange,
    disabled,
    name = "",
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name, []);

    controls = _.map(options as FBOption[], (option, index) => {
      const [value, message] = _.at(option, [optionValueKey!, optionLabelKey!]);
      const defaultChecked = _.includes(formValue, value);
      return (
        <FormControlLabel
          key={`${value}-${index}`}
          control={<Checkbox {...{ disabled, value, onChange, defaultChecked }} />}
          label={<Text {...{ message }} />}
        />
      );
    });

    return Component({
      ...(props as T),
      controls,
      disabled,
      name,
      onChange,
      options,
      optionValueKey,
      optionLabelKey,
    });
  };

  return withFBOption((props: T) => Comp(props));
};
