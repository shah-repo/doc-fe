import { reaction } from 'mobx';
import { useObserver } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { FB, FBEditorTextFieldWithRangeProps, FBFormState } from '..';
import { translate } from '../../../common/intl';

const useFieldCustomError = (formState: FBFormState, field: string, error: string) => {
  useEffect(() => reaction(
    () => formState?.errors.get(field),
    (value: string | undefined) => {
      if (value !== error) {
        formState.setFieldError(field, error);
      }
    },
  ), []);
};

export const withFBEditorTextFieldWithRange = <T extends FBEditorTextFieldWithRangeProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    inputProps,
    ...props
  }: T) => {
    const formState = FB.useRef<FBFormState>(FBFormState, { initialValues: inputProps });

    const [isRangeDisabled, isToleranceDisabled] = useObserver<[boolean, boolean]>(() => [
      formState?.getInputState('editorConfig.hasTolerance')?.value,
      formState?.getInputState('editorConfig.hasRange')?.value,
    ]);

    useEffect(() => reaction(
      () => formState?.getInputState('editorConfig.hasRange')?.value,
      (value: boolean | undefined) => setRange(value),
      { fireImmediately: true },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => formState?.getInputState('editorConfig.hasTolerance')?.value,
      (value: boolean | undefined) => setTolerance(value),
      { fireImmediately: true },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useFieldCustomError(formState, 'editorConfig.range.from', translate('validators.required'));
    useFieldCustomError(formState, 'editorConfig.range.to', translate('validators.required'));
    useFieldCustomError(formState, 'editorConfig.tolerance', translate('validators.required'));

    function setRange (value?: boolean) {
      formState.getInputState('editorConfig.range')?.setHidden(!value);
      if (!value) {
        formState.omitFieldValue('editorConfig.range');
      } else {
        formState.omitFieldValue('editorConfig.tolerance');
        formState.omitFieldValue('editorConfig.hasTolerance');
      }
    }

    function setTolerance (value?: boolean) {
      formState.getInputState('editorConfig.tolerance')?.setHidden(!value);
      if (!value) {
        formState.omitFieldValue('editorConfig.tolerance');
      } else {
        formState.omitFieldValue('editorConfig.range');
        formState.omitFieldValue('editorConfig.hasRange');
      }
    }

    return Component({
      ...(props as T),
      formState,
      inputProps,
      isRangeDisabled,
      isToleranceDisabled,
    });
  };

  Comp.displayName = 'withFBEditorTextFieldWithRange';
  return Comp;
};
