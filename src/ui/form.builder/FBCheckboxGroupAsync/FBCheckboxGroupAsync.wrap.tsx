import { Checkbox, FormControlLabel } from '@material-ui/core';
import { at, map, union, uniqBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { FB } from '..';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { OptionType } from '../../administration/general.settings/panels/SupplierSettings/SupplierConfiguration/types';
import { toastError } from '../../components/notifications';
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

    const [options, setOptions] = useState<CheckBoxOptionType[]>([]);
    const fetchSupplierConfigOptions = useActionCreator(documentRevisionsActions.fetchSupplierConfigurationOptions);

    const selectedTypes = useMemo(() =>
        workspaceState?.formInputSync?.get(SUPPLIER_TYPE_NAME) ?? [],
    [workspaceState?.formInputSync?.get(SUPPLIER_TYPE_NAME)],
    );

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;

    const async = useAsync<OptionType[]>({
      onSuccess: (list) => {
        setOptions(list?.map((item) => ({ ...item, value: item.id })) || []);
      },
      onError: toastError,
    });

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = event.target;
      const option = options?.find((opt) => opt.id === value);
      const optionText = option?.text || '';
      const selectedValues = formState?.getFieldValue(name, []);
      const updatedValues = checked
        ? union(selectedValues, [{ id: value, text: optionText }])
        : selectedValues.filter((item) => item.id !== value);

      formState?.setFieldValue(name, uniqBy(updatedValues, 'id'));
      workspaceState?.saveDocRev(formState?.getValues());
    };

    useEffect(() => {
      const isSupplierType = name === SUPPLIER_TYPE_NAME;
      if (!isSupplierType && !selectedTypes.length) {
        setOptions([]);
        return;
      }
      async.start(fetchSupplierConfigOptions, props.optionId, isSupplierType ? [] : selectedTypes?.map(item => item.id) || [], async);
    }, [selectedTypes]);

    controls = map(options, (option, index) => {
      const [value, message] = at(option, [optionValueKey, optionLabelKey]);
      const defaultChecked = formValue.some((vv) => vv.id === value);
      let attr = message;
      if (isTranslation(attr)) {
        attr = intl.formatMessage({ id: message });
      }
      formState?.setValidationAttributeName(value, attr);
      return (
        <FormControlLabel
          key={`${value}-${index}`}
          data-cy={`${message}-${index}`}
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
