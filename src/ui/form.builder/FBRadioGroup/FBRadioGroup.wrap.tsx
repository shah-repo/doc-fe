import { FormControlLabel, Radio } from "@material-ui/core";
import { at, map } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FB, FBOption, FBRadioGroupProps } from "..";
import { ReactComponent as CheckedRadioIcon } from "../../../assets/images/radio.svg";
import { ReactComponent as DisabledCheckedRadioIcon } from "../../../assets/images/radio_checked_disabled.svg";
import { ReactComponent as UnCheckedRadioIcon } from "../../../assets/images/unchecked_radio.svg";
import { ReactComponent as DisabledUnCheckedRadioIcon } from "../../../assets/images/unchecked_radio_disabled.svg";
import Text from "../../components/Text";
import { isTranslation } from "../../translations/types";
import { withFBOption } from "../FBOption/FBOption.wrap";

export const withFBRadioGroup = <T extends FBRadioGroupProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onChange,
    options,
    optionValueKey = "",
    optionLabelKey = "",
    controls,
    disabled,
    isInputOwner,
    name = "",
    defaultValue,
    controlValue,
    ...props
  }: T) => {
    const intl = useIntl();
    const { formState, workspaceState } = FB.useStores();

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;
    defaultValue = formState?.getFieldValue(name) || defaultValue;

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
          control={
            <Radio
              disableTouchRipple color="primary"
              icon={ disabled ? ( <DisabledUnCheckedRadioIcon /> ) : ( <UnCheckedRadioIcon /> ) }
              checkedIcon={ disabled ? <DisabledCheckedRadioIcon /> : <CheckedRadioIcon /> }
              {...{ disabled }}
              {...(controlValue && { checked: controlValue === value })}
            />}
          {...{ value }}
          label={<Text {...{ message }} />}
        />
      );
    });

    !onChange && (onChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
      formState?.setFieldValue(name, value);
      formState?.validate();
      const isUnderWorkspace = workspaceState?.getSchemaItem(name?.split(".")[0]);
      if (!isUnderWorkspace) { return; }
      workspaceState?.saveDocRev(formState?.getValues());
    });

    return Component({
      ...(props as T),
      onChange,
      defaultValue,
      controls,
      disabled,
      options,
      name,
    });
  };

  return withFBOption((props: T) => Comp(props));
};
