import { Checkbox, FormControlLabel } from "@material-ui/core";
import _ from "lodash";
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
    defaultValue = [],
    controls,
    disabled,
    name = "",
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name, defaultValue);
    const intl = useIntl();

    controls = _.map(options as FBOption[], (option, index) => {
      const [value, message] = _.at(option, [optionValueKey, optionLabelKey]);
      const defaultChecked = _.includes(formValue, value);
      let attr = message;
      if (isTranslation(attr)) {
        attr = intl.formatMessage({ id: message });
      }
      formState?.setValidationAttributeName(value, attr);
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
