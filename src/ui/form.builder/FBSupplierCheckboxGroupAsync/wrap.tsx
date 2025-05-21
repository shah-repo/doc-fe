import { Checkbox, FormControlLabel } from '@material-ui/core';
import { at, map, union, uniqBy } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useEffect, useMemo } from 'react';
import { FB } from '..';
import { translate } from '../../../common/intl';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { OptionType } from '../../administration/general.settings/panels/SupplierSettings/SupplierConfiguration/types';
import { toastError } from '../../components/notifications';
import Text from '../../components/Text';
import { checkIsDocumentForm } from '../../documentRevision/helpers/checkDocumentGroup';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { isTranslation } from '../../translations/types';
import { withFBOption } from '../FBOption/FBOption.wrap';
import { CheckBoxOptionType, FBSupplierCheckboxGroupAsyncProps } from './types';

const SUPPLIER_TYPE_NAME = 'supplier-type';

export const withFBSupplierCheckboxGroupAsync = <T extends FBSupplierCheckboxGroupAsyncProps>(
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
    setSelectedCheckBoxOptions,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const isMaintainOptionsStatus = workspaceState?.document?.status
    && [DocumentRevisionStatus.Released, DocumentRevisionStatus.InReview].includes(workspaceState?.document?.status);
    const formValue = formState?.getFieldValue(name) || defaultValue;
    const isDocumentForm = checkIsDocumentForm(workspaceState?.document?.document.documentType.groupOptions) || workspaceState?.isPreview || workspaceState?.isPreviewPanelVisible;

    options = useObserver(() => {
      const rawOptions = workspaceState?.checkboxGroupsOptionsMap.get(name) ?? [];
      const uniqueOptionsList: CheckBoxOptionType[] = [];
      const seenTexts = new Set<string>();

      for (const item of rawOptions) {
        if (!seenTexts.has(item.text)) {
          seenTexts.add(item.text);
          uniqueOptionsList.push(item);
        }
      }

      return uniqueOptionsList;
    });

    const fetchSupplierConfigOptions = useActionCreator(
      documentRevisionsActions.fetchSupplierConfigurationOptions,
    );

    const selectedTypes = useMemo(
      () => workspaceState?.formInputSync?.get(SUPPLIER_TYPE_NAME) ?? [],
      [workspaceState?.formInputSync?.get(SUPPLIER_TYPE_NAME)],
    );

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;

    const async = useAsync<OptionType[]>({
      onSuccess: (list) => {
        const optionsList
          = list?.map((item: OptionType) => ({ ...item, value: item.id })) || [];
        if (isMaintainOptionsStatus) {
          const existingSelections = formValue as Array<{id: string, text: string}>;
          existingSelections?.forEach(selection => {
            const optionPresent = optionsList?.find(option => option.id === selection.id);
            if (!optionPresent) {
              optionsList.push({ ...selection, value: selection.id });
            }
          });
        }
        setSelectedCheckBoxOptions?.(optionsList);
        workspaceState?.setCheckboxGroupsOptionsMap(name, optionsList);
      },
      onError: toastError,
    });

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = event.target;
      const option = options?.find((opt: CheckBoxOptionType) => opt?.id === value);
      const optionText = option?.text ?? '';
      const selectedValues = formState?.getFieldValue(name, []) as OptionType[];
      const updatedValues = checked
        ? union(selectedValues, [{ id: value, text: optionText }])
        : selectedValues.filter((item) => item.id !== value);
      const uniqValues = uniqBy(updatedValues, 'id');
      formState?.setFieldValue(name, uniqValues);
      setSelectedCheckBoxOptions?.(uniqValues);
      workspaceState?.saveDocRev(formState?.getValues());
    };

    useEffect(() => {
      const isSupplierType = name === SUPPLIER_TYPE_NAME;
      if (!isSupplierType && !selectedTypes.length && !isDocumentForm) {
        workspaceState?.setCheckboxGroupsOptionsMap(name, []);
        return;
      }
      const existingOptions = workspaceState?.checkboxGroupsOptionsMap?.get(name);

      if (existingOptions) {
        return;
      }

      async.start(
        fetchSupplierConfigOptions,
        props.optionId,
        isSupplierType || isDocumentForm ? [] : selectedTypes?.map((item) => item.id) || [],
        isDocumentForm,
        async,
      );
    }, [selectedTypes]);

    controls = map(options, (option, index) => {
      const [value, message] = at(option, [optionValueKey, optionLabelKey]) as string[];
      const defaultChecked = formValue?.some(
        (item) => item.id === value,
      ) as boolean;
      let attr = message;
      if (isTranslation(attr)) {
        attr = translate(message);
      }
      formState?.setValidationAttributeName(value, attr);
      return (
        <FormControlLabel
          key={`${value}-${index}`}
          data-cy={`${message}-${index}`}
          control={
            <Checkbox
              disabled={disabled || option.disabled}
              {...{ value, onChange, defaultChecked }}
            />
          }
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
