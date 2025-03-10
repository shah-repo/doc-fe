import { useObserver } from 'mobx-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { FB, FBApprovalMatrixFieldModes, FBApprovalRole } from '..';
import { userManagementSelectors } from '../../../state/ducks/userManagement';
import { AsyncStatus } from '../../../state/types';
import { FormHeaderContext } from '../../documentRevision/forms/DocumentRevisionForm.container';
import { FBApprovalMatrixRolesProps } from './types';

export const withFBApprovalMatrixRoles = <T extends FBApprovalMatrixRolesProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    approvalRoles,
    name,
    ...props
  }: T) => {
    const { approvalMatrixFieldState, workspaceState } = FB.useStores();
    const { asyncState } = React.useContext(FormHeaderContext) ?? {};

    const groups = useSelector(userManagementSelectors.getOfficialGroups).map((group) => ({
      id: group.value,
      name: group.label,
    }));

    const existingRoles = useObserver(() => approvalMatrixFieldState?.getCurrentData('roles') ?? []);

    approvalRoles = existingRoles.map((role) => {
      const foundGroups = role.groups.map(({ id }) => {
        const foundGroup = groups.find((group) => group.id === id);
        return foundGroup ?? { id, name: '' };
      });
      return {
        ...role,
        groups: foundGroups ?? [],
      };
    });

    const addRole = (role: FBApprovalRole) => {
      const groups = role.groups.map(({ id }) => ({ id }));
      approvalMatrixFieldState?.setMode(FBApprovalMatrixFieldModes.NONE);
      approvalMatrixFieldState?.addApprovalRole({
        ...role,
        employees: [],
        groups,
      });
    };

    const updateRole = (role: FBApprovalRole) => {
      const groups = role.groups.map(({ id }) => ({ id }));
      const updatedRoles = existingRoles.map((targetRole) => ({
        ...targetRole,
        groups: targetRole.id === role.id ? groups : targetRole.groups,
      }));
      approvalMatrixFieldState?.setMode(FBApprovalMatrixFieldModes.NONE);
      approvalMatrixFieldState?.setApprovalRoles(updatedRoles);
    };

    const isLoading = useObserver(
      () => asyncState?.status === AsyncStatus.Active || (workspaceState?.documentRevApi.loading ?? false),
    );

    return Component({
      ...(props as T),
      name,
      groups,
      approvalRoles,
      addRole,
      updateRole,
      isLoading,
    });
  };

  return (props: T) => Comp(props);
};
