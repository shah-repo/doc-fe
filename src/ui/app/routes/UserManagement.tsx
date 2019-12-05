import React from "react";
import { useSelector } from "react-redux";
import { getHasTag } from "../../../common/utils/selectors";
import { GroupTag } from "../../../state/ducks/auth/types";
import { USER_MANAGEMENT_ROOT_URL } from "../../constants/urls";
import NavigationLinkContainer from "../NavigationLink.container";

interface Props {
  pathname: string;
}
const UserManagementLink: React.FunctionComponent<Props> = ({
  pathname,
}) => {
  const canManageUsers = useSelector(getHasTag(GroupTag.USER_MANAGEMENT));

  if (!canManageUsers) {
    return null;
  }

  return (
    <NavigationLinkContainer
      url={USER_MANAGEMENT_ROOT_URL}
      text="navigation.user.management"
      currentPath={pathname}
    />
  );
};

export default UserManagementLink;
