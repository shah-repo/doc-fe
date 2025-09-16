import { reaction } from 'mobx';
import React, { useEffect } from 'react';
import { FB, FBEditorTextFieldWithRangeProps, FBFormState, FBPassType } from '..';

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

    useEffect(() => reaction(
      () => formState?.getInputState('editorConfig.inspection')?.value,
      (value: boolean) => setInspection(value),
      { fireImmediately: true },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => formState?.getInputState('editorConfig.passValue')?.value,
      (value: boolean) => setPassValue(value),
      { fireImmediately: true },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => formState?.getInputState('editorConfig.pass.type')?.value,
      (value: string | undefined) => setPassType(value),
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

    function setPassValue (value?: boolean) {
      formState.getInputState('editorConfig.pass.type')?.setHidden(!value);
      if (value) {
        formState.setFieldValue('editorConfig.pass.type', FBPassType.value, true);
      } else {
        formState.omitFieldValue('editorConfig.pass.type');
      }
    }

    function setInspection (value?: boolean) {
      formState.getInputState('editorConfig.passValue')?.setHidden(!value);
      formState.getInputState('editorConfig.aql')?.setHidden(!value);
      formState.getInputState('editorConfig.fai')?.setHidden(!value);
    }

    function setPassType (value?: string) {
      if (!value) {
        formState.getInputState('editorConfig.pass.percentage')?.setHidden(true);
        formState.getInputState('editorConfig.pass.value')?.setHidden(true);
        formState.omitFieldValue('editorConfig.pass');
        return;
      }
      const isPercentage = (value === FBPassType.percentage);
      formState.getInputState('editorConfig.pass.percentage')?.setHidden(!isPercentage);
      formState.getInputState('editorConfig.pass.value')?.setHidden(isPercentage);
      const omitFieldName = isPercentage
        ? 'editorConfig.pass.value'
        : 'editorConfig.pass.percentage';
      formState.omitFieldValue(omitFieldName);
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
