import { cloneDeep } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { FB, FBApprovalMatrixFieldProps, FBApprovalMatrixFieldState, FBDAMFields } from '..';

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
    const { document: { outputRevision = false } = {}, formInput, isOutput } = workspaceState || {};

    const approvalMatrixState = !approvalMatrixFieldState ? (
      FB.useRef<FBApprovalMatrixFieldState>(FBApprovalMatrixFieldState, {
        formValue: cloneDeep(formInput),
        outputRevision,
        isOutput,
      })) : approvalMatrixFieldState;

    handleAdd = () => {
      approvalMatrixFieldState && (approvalMatrixFieldState.mode = 'add');
    };

    React.useEffect(() => {
      return reaction( // Form sync & autosave
        () => approvalMatrixFieldState?.data,
        (data) => {
          formState?.setFieldValue(FBDAMFields.DAM, cloneDeep(data?.approvalMatrix));
          formState?.setFieldValue(FBDAMFields.DAR, cloneDeep(data?.approvalRoles));
          if (approvalMatrixFieldState?.mode !== 'refresh') {
            formState?.setFieldAutosave(name);
          }
          approvalMatrixFieldState?.setMode('none');
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
