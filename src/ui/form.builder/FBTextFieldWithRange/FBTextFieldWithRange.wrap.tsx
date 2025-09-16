import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import { FB, FBPassValue, FBRangeValue, FBTextFieldWithRangeProps, FBTextFieldWithRangeValue } from '..';
import { translate } from '../../../common/intl';

export const withFBTextFieldWithRange = <T extends FBTextFieldWithRangeProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    editorConfig,
    includeInFaiInspection,
    name = '',
    label = '',
    ...props
  }: T) => {
    const { aql, pass, range, criticalToQuality, tolerance } = editorConfig;
    const { formState } = FB.useStores();

    const value = useObserver<FBTextFieldWithRangeValue | undefined>(
      () => formState?.newValues.get(name) ?? formState?.getFieldValue(name),
    );

    const isPartFaiRequired = useObserver(
      () => (
        formState?.newValues.get('fai-required') ?? formState?.getFieldValue('fai-required')
      ) === translate('form.builder.yes'),
    );
    const isPartIqcRequired = useObserver(
      () => (
        formState?.newValues.get('iqc-required') ?? formState?.getFieldValue('iqc-required')
      ) === translate('form.builder.yes'),
    );

    const [helperText, isError] = useObserver(
      () => [formState?.getFieldError(`${name}.value`), formState?.errors.has(`${name}.value`)],
    );

    const calculatePassValue = (passRange?: FBPassValue): FBRangeValue | undefined => {
      if (!passRange) { return; }
      if (passRange.type === 'value') { return passRange.value; }
      if (!passRange.percentage) { return; }
      const { decrease, increase, value } = passRange.percentage;
      if (!decrease || !increase || !value) { return; }
      const from = Number(value) * (1 - decrease / 100);
      const to = Number(value) * (1 + increase / 100);
      return { from, to };
    };

    const getRules = (): string => {
      if (!range) { return ''; }
      if (range.from && range.to) {
        return `between:${range.from},${range.to}`;
      }
      if (range.from && !range.to) {
        return `min:${range?.from}`;
      }
      if (!range.from && range.to) {
        return `max:${range?.to}`;
      }
      return '';
    };

    formState?.setFieldRules(`${name}.value`, getRules());
    formState?.setValidationAttributeName(`${name}.value`, String(label));

    const updateValue = (newValue: Partial<FBTextFieldWithRangeValue>) => {
      formState?.setFieldValue(name, {
        ...value,
        ...newValue,
      });
      formState?.setFieldAutosave(name);
    };

    useEffect(() => {
      updateValue({
        isFaiRequired: isPartFaiRequired && value?.isFaiRequired,
        isIqcRequired: isPartIqcRequired && value?.isIqcRequired,
      });
    }, [isPartFaiRequired, isPartIqcRequired, value?.isFaiRequired, value?.isIqcRequired]);

    return Component({
      ...(props as T),
      name,
      label,
      value,
      aql,
      error: isError,
      helperText,
      criticalToQuality,
      includeInFaiInspection,
      isPartFaiRequired,
      isPartIqcRequired,
      onUpdate: updateValue,
      pass: calculatePassValue(pass),
      range,
      tolerance,
    });
  };

  Comp.displayName = 'withFBTextFieldWithRange';
  return Comp;
};
