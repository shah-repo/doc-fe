import { reaction } from 'mobx';
import React, { useEffect } from 'react';
import { FB, FBEditorTextFieldWithRangeProps, FBFormState } from '..';

export const withFBEditorTextFieldWithRange = <T extends FBEditorTextFieldWithRangeProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    inputProps,
    ...props
  }: T) => {
    const formState = FB.useRef<FBFormState>(FBFormState, { initialValues: inputProps });

    useEffect(() => reaction(
      () => formState?.getInputState('editorConfig.rangeOption')?.value,
      (value: boolean | undefined) => setRange(value),
      { fireImmediately: true },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => formState?.getInputState('editorConfig.toleranceOption')?.value,
      (value: boolean | undefined) => setTolerance(value),
      { fireImmediately: true },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers
    function setRange (value?: boolean) {
      formState.getInputState('editorConfig.range')?.setHidden(!value);
      if (!value) {
        formState.omitFieldValue('editorConfig.range');
      }
    }

    function setTolerance (value?: boolean) {
      formState.getInputState('editorConfig.tolerance')?.setHidden(!value);
      if (!value) {
        formState.omitFieldValue('editorConfig.tolerance');
      }
    }

    return Component({
      ...(props as T),
      formState,
      inputProps,
    });
  };

  Comp.displayName = 'withFBEditorTextFieldWithRange';
  return Comp;
};
