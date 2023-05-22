import React from 'react';
import { useObserver } from 'mobx-react';
import { isEmpty, get, set, has } from 'lodash';
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixItem, FBDAMFields } from '..';
import { FBApprovalMatrixProps } from './types';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import SM from '../../../App/Shifamed/Utils/SM/SM';

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

    const { document, formInput } = workspaceState ?? {};
    const { status } = document ?? {};
    const approvalRoles = get(formInput, FBDAMFields.DAR, []);
    const formInputDAM = get(formInput, FBDAMFields.DAM, []);
    const isDAMInNewFormat = has(formInputDAM, 'approvalMatrix');
    const approvalMatrix = isDAMInNewFormat ? formInputDAM.approvalMatrix : formInputDAM;

    // Clear statuses for deprecated documents.
    withoutStatus = status === DocumentRevisionStatus.Deprecated;

    data = useObserver(() => {
      const matrix = withoutStatus
        ? (approvalMatrix ?? []).map(item => set(item, 'docType.active', undefined))
        : approvalMatrix;

      return {
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
