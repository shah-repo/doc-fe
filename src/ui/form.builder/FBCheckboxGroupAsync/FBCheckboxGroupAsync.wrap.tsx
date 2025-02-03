import { Checkbox, FormControlLabel } from '@material-ui/core';
import { at, map, union, uniqBy } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useEffect, useMemo } from 'react';
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
import { FBCheckboxGroupAsyncProps } from './FBCheckboxGroupAsync.types';

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
    options,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || defaultValue;
    const intl = useIntl();

    options = useObserver(() => workspaceState?.checkboxGroupsOptionsMap.get(name) ?? []);
    const fetchSupplierConfigOptions = useActionCreator(documentRevisionsActions.fetchSupplierConfigurationOptions);

    const selectedTypes = useMemo(() =>
        workspaceState?.formInputSync?.get(SUPPLIER_TYPE_NAME) ?? [],
    [workspaceState?.formInputSync?.get(SUPPLIER_TYPE_NAME)],
    );

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;

    const async = useAsync<OptionType[]>({
      onSuccess: (list) => {
        const optionsList = list?.map((item) => ({ ...item, value: item.id })) || [];
        workspaceState?.setCheckboxGroupsOptionsMap(name, optionsList);
      },
      onError: toastError,
    });

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = event.target;
      const option = options?.find((opt) => opt.id === value);
      const optionText = (option?.text || '') as string;
      const selectedValues = formState?.getFieldValue(name, []) as OptionType[];
      const updatedValues = checked
        ? union(selectedValues, [{ id: value, text: optionText }])
        : selectedValues.filter((item) => item.id !== value);

      formState?.setFieldValue(name, uniqBy(updatedValues, 'id'));
      workspaceState?.saveDocRev(formState?.getValues());
    };

    useEffect(() => {
      const isSupplierType = name === SUPPLIER_TYPE_NAME;
      if (!isSupplierType && !selectedTypes.length) {
        workspaceState?.setCheckboxGroupsOptionsMap(name, []);
        return;
      }
      async.start(fetchSupplierConfigOptions, props.optionId, isSupplierType ? [] : selectedTypes?.map(item => item.id) || [], async);
    }, [selectedTypes]);

    controls = map(options, (option, index) => {
      const [value, message] = at(option, [optionValueKey as keyof typeof option, optionLabelKey as keyof typeof option]) as string[];
      const defaultChecked = formValue?.some((item) => item.id === value) as boolean;
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
