import { get, isEmpty, isUndefined, omit } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useCallback } from 'react';
import { v4 as generateUuid } from 'uuid';
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixFieldModes, FBApprovalMatrixItem } from '..';
import { SM } from '../../../App';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { MODE_FIELD } from './components/Grid';
import { DEFAULT_CATEGORY_LABEL } from './constants';
import { FBApprovalMatrixProps } from './types';

export const withFBApprovalMatrix = <T extends FBApprovalMatrixProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    handleSave,
    disabled,
    name = '',
    mode = FBApprovalMatrixFieldModes.NONE,
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

    handleSave = useCallback((data: FBApprovalMatrixItem[]) => {
      const approvalMatrix = data.map(({ id, docType, ...restItem }) => {
        const category = docType.updatedCategory !== DEFAULT_CATEGORY_LABEL
          ? docType.updatedCategory
          : docType.category;

        return ({
          id: id ?? generateUuid(),
          docType: {
            ...omit(docType, 'updatedCategory'),
            category,
            acronym: docType.acronym.toUpperCase(),
          },
          ...omit(restItem, MODE_FIELD, 'errors'),
        });
      }) as FBApprovalMatrixItem[];

      if (isEmpty(approvalMatrix)) { return; }

      approvalMatrixFieldState?.setMode(FBApprovalMatrixFieldModes.NONE);
      approvalMatrixFieldState?.setApprovalMatrix(approvalMatrix);
    }, [approvalMatrixFieldState]);

    const { document, formInput } = workspaceState ?? {};
    const { status } = document ?? {};

    useObserver(() => {
      const approvalRoles = approvalMatrixFieldState?.getCurrentData('roles')
        ?? approvalMatrixFieldState?.extractData(formInput as FBApprovalMatrixFieldData, 'roles')
        ?? [];

      const approvalMatrix = approvalMatrixFieldState?.getCurrentData('matrix')
        ?? approvalMatrixFieldState?.extractData(formInput as FBApprovalMatrixFieldData, 'matrix')
        ?? [];

      // Clear statuses for deprecated documents and items without active status.
      withoutStatus = status === DocumentRevisionStatus.Deprecated
        || approvalMatrix.some(item => isUndefined(get(item, 'docType.active', undefined)));

      const matrix = (approvalMatrix ?? []).map(item => ({
        ...item,
        docType: {
          ...item.docType,
          active: withoutStatus ? undefined : item.docType.active,
          updatedCategory: isEmpty(item.docType.category)
            ? DEFAULT_CATEGORY_LABEL
            : item.docType.category,
        },
      }));

      data = {
        ...approvalMatrixFieldState?.data as FBApprovalMatrixFieldData,
        approvalMatrix: matrix,
        approvalRoles: [...approvalRoles].sort((a, b) => a.index - b.index),
      };

      size = _tabsState?.contentSize;
    });

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
