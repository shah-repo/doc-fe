import { FormControlLabel, Radio } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { FBRadioGroupProps } from ".";
import { FBOption } from "..";
import Text from "../../components/Text";
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
    ...props
  }: T) => {

    controls = _.map(options as FBOption[], (option, index) => {
      const [value, message] = _.at(option, [optionValueKey, optionLabelKey]);
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
    });
  };

  return withFBOption((props: T) => Comp(props));
};
