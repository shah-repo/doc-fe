import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import { FB, FBTextFieldWithRangeProps, FBTextFieldWithRangeValue } from '..';
import { translate } from '../../../common/intl';

const getRules = (from?: number, to?: number): string => {
  if (from && to) {
    return `between:${from},${to}`;
  }
  if (from && !to) {
    return `min:${from}`;
  }
  if (!from && to) {
    return `max:${to}`;
  }
  return '';
};

export const withFBTextFieldWithRange = <T extends FBTextFieldWithRangeProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    editorConfig = {},
    name = '',
    label = '',
    ...props
  }: T) => {
    const {
      hasUnits,
      isCriticalToQuality,
      isInspected,
      hasRange,
      range,
      hasTolerance,
      tolerance = 0,
    } = editorConfig;

    const from = range?.from ? range.from + tolerance : undefined;
    const to = range?.to ? range.to - tolerance : undefined;

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

    const [helperText, isInvalid] = useObserver(
      () => [formState?.getFieldError(`${name}.value`), formState?.errors.has(`${name}.value`)],
    );

    formState?.setFieldRules(`${name}.value`, getRules(from, to));
    formState?.setValidationAttributeName(`${name}.value`, String(label));

    const updateValue = (newValue: Partial<FBTextFieldWithRangeValue>) => {
      formState?.setFieldValue(name, {
        ...value,
        ...newValue,
      });
      formState?.validate();
      formState?.setFieldAutosave(name);
    };

    useEffect(() => {
      updateValue({
        isFaiRequired: isPartFaiRequired && value?.isFaiRequired,
        isIqcRequired: isPartIqcRequired && value?.isIqcRequired,
      });
    }, [isInspected, isPartFaiRequired, isPartIqcRequired, value?.isFaiRequired, value?.isIqcRequired]);

    return Component({
      ...(props as T),
      name,
      label,
      value,
      error: isInvalid,
      helperText,
      isCriticalToQuality,
      isInspected,
      hasUnits,
      hasRange,
      hasTolerance,
      isPartFaiRequired,
      isPartIqcRequired,
      range: { from, to },
      tolerance,
      onUpdate: updateValue,
    });
  };

  Comp.displayName = 'withFBTextFieldWithRange';
  return Comp;
};
