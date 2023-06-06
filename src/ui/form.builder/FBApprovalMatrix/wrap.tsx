import { get, isArray, isEmpty, isUndefined, omit, set } from 'lodash';
import { useObserver } from 'mobx-react';
import React from 'react';
import { v4 as generateUuid } from 'uuid';
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixItem, FBDAMFields } from '..';
import { SM } from '../../../App';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { DEFAULT_CATEGORY_LABEL } from './constants';
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
    withoutStatus,
    size,
    ...props
  }: T) => {
    const { approvalMatrixFieldState, workspaceState } = FB.useStores();
    const { _tabsState } = SM.useStores();

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled
      || (workspaceState && !['design', 'form'].includes(workspaceState.mode));

    handleSave = (data: FBApprovalMatrixItem[]) => {
      const approvalMatrix = data.map(({ id, docType, ...restItem }) => {
        if (docType.updatedCategory !== DEFAULT_CATEGORY_LABEL) {
          set(docType, 'category', docType.updatedCategory);
        }
        return ({
          id: id ?? generateUuid(),
          docType: {
            ...omit(docType, 'updatedCategory'),
            acronym: docType.acronym.toUpperCase(),
          },
          ...restItem,
        });
      });

      if (isEmpty(approvalMatrix)) { return; }

      approvalMatrixFieldState?.setApprovalMatrix(approvalMatrix);
      approvalMatrixFieldState?.setMode('none');
    };

    const { document, formInput } = workspaceState ?? {};
    const { status } = document ?? {};

    useObserver(() => {
      let approvalRoles = get(formInput, FBDAMFields.DAR)
        ?? get(formInput, 'approvalRoles')
        ?? approvalMatrixFieldState?.getCurrentData('roles')
        ?? [];

      if (!isArray(approvalRoles)) {
        approvalRoles = get(approvalRoles, 'approvalRoles');
      }

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

    size = useObserver(() => _tabsState?.contentSize);

    return Component({
      ...(props as T),
      handleSave,
      disabled,
      name,
      mode,
      data,
      withoutStatus,
      size,
    });
  };

  return (props: T) => Comp(props);
};
