import React from 'react';
import { useObserver } from 'mobx-react';
import { isEmpty, get, has } from 'lodash';
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixItem, FBDAMFields } from '..';
import { FBApprovalMatrixProps } from './types';

export const withFBApprovalMatrix = <T extends FBApprovalMatrixProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleSave,
    disabled,
    name = '',
    mode = 'none',
    isInputOwner,
    data,
    ...props
  }: T) => {
    const { approvalMatrixFieldState, workspaceState } = FB.useStores();

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled
      || (workspaceState && !['design', 'form'].includes(workspaceState.mode));

    handleSave = (data: FBApprovalMatrixItem[]) => {
      const approvalMatrix = data.map((e) => {
        const categoryTrim = e?.docType.category?.trim();
        return {
          ...e,
          docType: {
            ...e?.docType,
            acronym: e?.docType.acronym?.toUpperCase(),
            category: categoryTrim ?? '',
          },
        };
      });

      if (isEmpty(approvalMatrix)) { return; }

      approvalMatrixFieldState?.setApprovalMatrix(approvalMatrix);
      approvalMatrixFieldState?.setMode('none');
    };

    const { formInput } = workspaceState || {};
    const approvalRoles = get(formInput, FBDAMFields.DAR, []);
    const formInputDAM = get(formInput, FBDAMFields.DAM, []);
    const isDAMInNewFormat = has(formInputDAM, 'approvalMatrix');
    const approvalMatrix = isDAMInNewFormat ? formInputDAM.approvalMatrix : formInputDAM;

    data = useObserver(() => ({
      ...approvalMatrixFieldState?.data as FBApprovalMatrixFieldData,
      approvalMatrix,
      approvalRoles,
    }));

    return Component({
      ...(props as T),
      handleSave,
      disabled,
      name,
      mode,
      data,
    });
  };

  return (props: T) => Comp(props);
};
