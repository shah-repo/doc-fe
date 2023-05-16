import { get } from 'lodash';
import { reaction } from 'mobx';
import React, { useEffect } from 'react';
import { FB, FBLHRBuildOptions, FBLHRBuildProps, FBLHRBuildState } from '..';
import { SMDialogAction } from '../../../App';
import { withSMDialog } from '../../../App/Shifamed/Components/SMDialog/SMDialog.hoc';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { useFormContext } from '../../components/forms/FormContext';

export const withFBLHRBuild = <T extends FBLHRBuildProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onChange,
    onDialogActionClick,
    inputState,
    lhrBuildState,
    dialogState,
    name = '',
    disabled,
    buildValidationRules,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const { isOutput, document } = workspaceState || {};
    const formContext = useFormContext();
    buildValidationRules = isOutput || (!isOutput && document?.status === DocumentRevisionStatus.Released) ?
      'required' : null;

    lhrBuildState = FB.useRef(FBLHRBuildState, {
      value: formState?.getFieldValue(name),
      disabled,
    });

    useEffect(() => {
      const isOutput = workspaceState?.isOutput;
      const savedData = get(workspaceState?.document?.formInput, name);
      formState?.validate();

      if (isOutput && savedData === FBLHRBuildOptions['R&D']) {
        lhrBuildState?.setDisabled(true);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @helpers
    function save() {
      formContext.submitForm();
    }

    // MARK: @reactions
    useEffect(() => reaction(
      () => lhrBuildState?.value,
      (value) => {
        formState?.setFieldValue(name, value);
        workspaceState?.formInputSync.set(name, value);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => workspaceState?.formInputSync.get(name),
      (value) => {
        const { autosave } = workspaceState || {};
        const isDisabled = (autosave && (value === FBLHRBuildOptions['R&D'])) || disabled;
        lhrBuildState?.setDisabled(isDisabled);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @methods
    onChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
      const formValue = formState?.getFieldValue(name);
      if (value === FBLHRBuildOptions['R&D'] && formValue === FBLHRBuildOptions.Production) {
        lhrBuildState?.setValue(FBLHRBuildOptions.Production);
        dialogState?.setOpen?.(true);
        return;
      }
      lhrBuildState?.setValue(value);
      save();
    };

    onDialogActionClick = (action: SMDialogAction) => {
      if (action === SMDialogAction.cancel) {
        const formValue = formState?.getFieldValue(name);
        lhrBuildState?.setValue(formValue);
        return;
      }
      const { autosave } = workspaceState || {};
      lhrBuildState?.setValue(FBLHRBuildOptions['R&D']);
      lhrBuildState?.setDisabled(autosave);
      save();
    };

    return Component({
      ...(props as T),
      onChange,
      onDialogActionClick,
      lhrBuildState,
      name,
      buildValidationRules,
    });
  };

  Comp.displayName = 'withFBLHRBuild';
  return withSMDialog((props: T) => Comp(props));
};
