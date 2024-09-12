import { Checkbox, FormControlLabel } from '@material-ui/core';
import { at, includes, map } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { FB } from '..';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { OptionType } from '../../administration/general.settings/panels/SupplierSettings/SupplierConfiguration/types';
import Text from '../../components/Text';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { isTranslation } from '../../translations/types';
import { withFBOption } from '../FBOption/FBOption.wrap';
import { CheckBoxOptionType, FBCheckboxGroupAsyncProps } from './FBCheckboxGroupAsync.types';

const SUPPLIER_TYPE_NAME = 'supplier-type';

export const withFBCheckboxGroupAsync = <T extends FBCheckboxGroupAsyncProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onChange,
    optionValueKey = '',
    optionLabelKey = '',
    defaultValue,
    controls,
    disabled,
    name = '',
    isInputOwner,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || defaultValue;
    const intl = useIntl();

    const selectedTypes = useMemo(() => {
      return workspaceState?.formInputSync?.get(SUPPLIER_TYPE_NAME) ?? [];
    }, [workspaceState?.formInputSync?.get(SUPPLIER_TYPE_NAME), name]);

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;

    const [options, setOptions] = useState<CheckBoxOptionType[]>();

    const fetchSupplierConfigOptions = useActionCreator(documentRevisionsActions.fetchSupplierConfigurationOptions);

    const async = useAsync<OptionType[]>({
      onSuccess: (aslStatusList) => {
        setOptions(aslStatusList?.map((dd) => { return { ...dd, value: dd.id }; }));
      },
    });

    useEffect(() => {
      const isSupplierType = name === SUPPLIER_TYPE_NAME;
      if (!isSupplierType && !selectedTypes.length) {
        setOptions([]);
        return;
      }
      async.start(fetchSupplierConfigOptions, props.optionId, isSupplierType ? [] : selectedTypes || [], async);
    }, [selectedTypes]);

    controls = map(options as CheckBoxOptionType[], (option, index) => {
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
