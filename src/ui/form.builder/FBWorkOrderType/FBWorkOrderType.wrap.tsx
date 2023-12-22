import { FormControlLabel, Radio } from '@material-ui/core';
import { at, map } from 'lodash';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { FB, FBOption } from '..';
import { ReactComponent as CheckedRadioIcon } from '../../../assets/images/radio.svg';
import { ReactComponent as DisabledCheckedRadioIcon } from '../../../assets/images/radio_checked_disabled.svg';
import { ReactComponent as UnCheckedRadioIcon } from '../../../assets/images/unchecked_radio.svg';
import { ReactComponent as DisabledUnCheckedRadioIcon } from '../../../assets/images/unchecked_radio_disabled.svg';
import { WorkOrderTypes, WO_LHR_TABLE_KEY_NAME, WO_LOT_ID_KEY_NAME, WO_PART_KEY_NAME, WO_PART_QTY_KEY_NAME, WO_PART_UNIT_KEY_NAME } from '../../../state/ducks/documentRevisions/documentType/types';
import Text from '../../components/Text';
import useDialog from '../../hooks/useDialog';
import { isTranslation } from '../../translations/types';
import { withFBOption } from '../FBOption/FBOption.wrap';
import { FBWorkOrderTypeProps } from './FBWorkOrderType.types';

export const withFBWorkOrderType = <T extends FBWorkOrderTypeProps>(
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
    confirmationDialog,
    name = '',
    setForceRender,
    forceRender,
    defaultValue,
    controlValue,
    ...props
  }: T) => {
    const intl = useIntl();
    const { formState, workspaceState } = FB.useStores();

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;
    defaultValue = formState?.getFieldValue(name) || defaultValue;

    confirmationDialog = useDialog();

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

    const [event, setEvent] = useState<any>();
    const [prevOption, setPrevOption] = useState(defaultValue);

    const handleChange: FBWorkOrderTypeProps['onChange'] = (...args) => {
      if (prevOption) {
        args[0].persist();
        confirmationDialog?.open();
        setEvent(args);
      } else {
        onChange?.(...args);
        setPrevOption(args[1]);
      }
    };

    const clearFieldByName = (name, value) => {
      formState?.setFieldValue(name, value);
        workspaceState?.formInputSync.set(name, value);
        formState?.getInputState(name)?.setRender();
    };

    const confirmAlertDialog = () => {
      confirmationDialog?.close();
      const selectedOption = event[1];

      if (selectedOption === WorkOrderTypes.OTHER) {
        clearFieldByName(WO_LHR_TABLE_KEY_NAME, []);
        clearFieldByName(WO_PART_UNIT_KEY_NAME, '');
        clearFieldByName(WO_PART_QTY_KEY_NAME, 0);
        clearFieldByName(WO_PART_KEY_NAME, '');
        clearFieldByName(WO_LOT_ID_KEY_NAME, '');
      } else if (prevOption === WorkOrderTypes.MAKE_PRODUCT) {
        clearFieldByName(WO_LHR_TABLE_KEY_NAME, []);
      } else if (prevOption === WorkOrderTypes.MAKE_KIT) {
        clearFieldByName(WO_LOT_ID_KEY_NAME, '');
      }

      onChange?.(event[0], selectedOption);
      setPrevOption(selectedOption);
    };

    const cancelAlertDialog = () => {
      confirmationDialog?.close();
      setPrevOption(prevOption);
      setForceRender(!forceRender);
    };

    return Component({
      ...(props as T),
      onChange: handleChange,
      defaultValue,
      confirmationDialog,
      confirmAlertDialog,
      cancelAlertDialog,
      controls,
      disabled,
      options,
      name,
    });
  };

  return withFBOption((props: T) => Comp(props));
};
