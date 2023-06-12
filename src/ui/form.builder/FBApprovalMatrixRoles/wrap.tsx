import { cloneDeep } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FB, FBApprovalMatrixFieldData, FBApprovalRole } from '..';
import { userManagementSelectors } from '../../../state/ducks/userManagement';
import { FBApprovalMatrixRolesProps } from './types';

export const withFBApprovalMatrixRoles = <T extends FBApprovalMatrixRolesProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    approvalRoles,
    name,
    ...props
  }: T) => {
    const { workspaceState, formState, approvalMatrixFieldState } = FB.useStores();
    const { formInput } = workspaceState ?? {};

    const groups = useSelector(userManagementSelectors.getOfficialGroups).map((group) => ({
      id: group.value,
      name: group.label,
    }));

    const existingRoles = useObserver(
      () => (
        approvalMatrixFieldState?.getCurrentData('roles')
          ?? approvalMatrixFieldState?.extractData(formInput as FBApprovalMatrixFieldData, 'roles')
          ?? []
      ),
    );

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
      approvalMatrixFieldState?.setApprovalRoles(updatedRoles);
    };

    useEffect(() => {
      reaction(
        () => approvalMatrixFieldState?.data,
        (data) => {
          formState?.setFieldValue(name, cloneDeep(data));
          formState?.setFieldAutosave(name);
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      name,
      groups,
      approvalRoles,
      addRole,
      updateRole,
    });
  };

  return (props: T) => Comp(props);
};
