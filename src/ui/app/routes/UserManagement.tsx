import React from "react";
import { GroupTag } from "../../../state/ducks/auth/types";
import { USER_MANAGEMENT_ROOT_URL } from "../../constants/urls";
import useGetHasTag from "../../hooks/useGetHasTag";
import NavigationLinkContainer from "../NavigationLink.container";

interface Props {
  pathname: string;
}

// TODO: remove this component ones navigation configuration is implemented
const UserManagementLink: React.FunctionComponent<Props> = ({
  pathname,
}) => {
  const canManageUsers = useGetHasTag(GroupTag.USER_MANAGEMENT);

  if (!canManageUsers) {
    return null;
  }

  return (
    <NavigationLinkContainer
      link={USER_MANAGEMENT_ROOT_URL}
      label="navigation.user.management"
      currentPath={pathname}
      type="LINK"
    />
  );
};

export default UserManagementLink;
