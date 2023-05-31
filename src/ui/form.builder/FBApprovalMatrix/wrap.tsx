import React from 'react';
import { useObserver } from 'mobx-react';
import { isEmpty, set, get, isUndefined } from 'lodash';
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixItem, FBDAMFields } from '..';
import { FBApprovalMatrixProps } from './types';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { v4 as generateUuid } from 'uuid';

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
    withoutStatus,
    ...props
  }: T) => {
    const { approvalMatrixFieldState, workspaceState } = FB.useStores();

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled
      || (workspaceState && !['design', 'form'].includes(workspaceState.mode));

    handleSave = (data: FBApprovalMatrixItem[]) => {
      const approvalMatrix = data.map(({ id, docType, ...restItem }) => ({
        id: id ?? generateUuid(),
        docType: {
          ...docType,
          acronym: docType.acronym.toUpperCase(),
        },
        ...restItem,
      }));

      if (isEmpty(approvalMatrix)) { return; }

      approvalMatrixFieldState?.setApprovalMatrix(approvalMatrix);
      approvalMatrixFieldState?.setMode('none');
    };

    const { document, formInput } = workspaceState ?? {};
    const { status } = document ?? {};

    useObserver(() => {
      const approvalRoles = get(formInput, FBDAMFields.DAR)
        ?? get(formInput, 'approvalRoles')
        ?? approvalMatrixFieldState?.getCurrentData('roles')
        ?? [];

      const approvalMatrix = get(formInput, FBDAMFields.DAM)
        ?? get(formInput, 'approvalMatrix')
        ?? approvalMatrixFieldState?.getCurrentData('matrix')
        ?? [];

      // Clear statuses for deprecated documents and items without active status.
      withoutStatus = status === DocumentRevisionStatus.Deprecated
        || approvalMatrix.some(item => isUndefined(get(item, 'docType.active', undefined)));

      const matrix = withoutStatus
        ? (approvalMatrix ?? []).map(item => set(item, 'docType.active', undefined))
        : approvalMatrix;

      data = {
        ...approvalMatrixFieldState?.data as FBApprovalMatrixFieldData,
        approvalMatrix: matrix,
        approvalRoles,
      };
    });

    return Component({
      ...(props as T),
      handleSave,
      disabled,
      name,
      mode,
      data,
      withoutStatus,
    });
  };

  return (props: T) => Comp(props);
};
