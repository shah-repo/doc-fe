import { FormControlLabel, Radio } from '@material-ui/core';
import { at, isNil, map } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { FB, FBOption, FBRadioGroupProps } from '..';
import { ReactComponent as CheckedRadioIcon } from '../../../assets/images/radio.svg';
import { ReactComponent as DisabledCheckedRadioIcon } from '../../../assets/images/radio_checked_disabled.svg';
import { ReactComponent as UnCheckedRadioIcon } from '../../../assets/images/unchecked_radio.svg';
import { ReactComponent as DisabledUnCheckedRadioIcon } from '../../../assets/images/unchecked_radio_disabled.svg';
import Text from '../../components/Text';
import { BOM_FIELDS_CHANGES_KEY, BOM_LINE_CHANGES_KEY } from '../../document.revision/utils/helpers';
import { isTranslation } from '../../translations/types';
import { withFBOption } from '../FBOption/FBOption.wrap';

export const withFBRadioGroup = <T extends FBRadioGroupProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    onChange,
    options,
    optionValueKey = '',
    optionLabelKey = '',
    controls,
    disabled,
    isInputOwner,
    name = '',
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
              icon={ disabled ? (<DisabledUnCheckedRadioIcon />) : (<UnCheckedRadioIcon />) }
              checkedIcon={ disabled ? <DisabledCheckedRadioIcon /> : <CheckedRadioIcon /> }
              {...{ disabled }}
              {...(controlValue && { checked: controlValue === value })}
            />}
          {...{ value }}
          label={<Text {...{ message }} />}
        />
      );
    });

    // TODO Move it out and create a composite FB component for BOM_LINE_CHANGES_KEY
    const handleChange: FBRadioGroupProps['onChange'] = (...args) => {
      if (
        name === BOM_LINE_CHANGES_KEY
        && isNil(formState?.getFieldValue(BOM_FIELDS_CHANGES_KEY))
      ) {
        // settings default comment and refDesignator fields when bom-line-changes are selected on restricted edit mode
        formState?.setFieldValue(BOM_FIELDS_CHANGES_KEY, [
          'comment',
          'refDesignator',
        ]);
      }
      onChange?.(...args);
    };

    return Component({
      ...(props as T),
      onChange: handleChange,
      defaultValue,
      controls,
      disabled,
      options,
      name,
    });
  };

  return withFBOption((props: T) => Comp(props));
};
