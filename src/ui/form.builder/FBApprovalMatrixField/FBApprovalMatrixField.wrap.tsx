import { cloneDeep } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { FB, FBApprovalMatrixFieldProps, FBApprovalMatrixFieldState } from '..';

export const withFBApprovalMatrixField = <T extends FBApprovalMatrixFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleAdd,
    disabled,
    name,
    mode,
    type,
    ...props
  }: T) => {

    const { formState, approvalMatrixFieldState, workspaceState } = FB.useStores();
    const { document: { outputRevision = false } = {}, isOutput } = workspaceState || {};
    const formValue = formState?.getFieldValue(name);

    const approvalMatrixState = !approvalMatrixFieldState ? (
      FB.useRef<FBApprovalMatrixFieldState>(FBApprovalMatrixFieldState, {
        formValue: { [type as string]: cloneDeep(formValue) },
        outputRevision,
        isOutput,
      })) : approvalMatrixFieldState;

    handleAdd = () => {
      approvalMatrixFieldState && (approvalMatrixFieldState.mode = 'add');
    };

    React.useEffect(() => {
      reaction( // Form sync & autosave
        () => approvalMatrixFieldState?.data,
        (data) => {
          formState?.setFieldValue(name, cloneDeep(data?.[type || '']));
          formState?.setFieldAutosave(name);
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      handleAdd,
      approvalMatrixFieldState: approvalMatrixState,
      disabled,
      name,
      mode,
    });
  };

  return (props: T) => Comp(props);
};
