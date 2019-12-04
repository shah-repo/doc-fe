import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { GroupTag } from "../../../state/ducks/auth/types";
import { ApplicationState } from "../../../state/reducers";
import { USER_MANAGEMENT_ROOT_URL } from "../../constants/urls";
import NavigationLinkContainer from "../NavigationLink.container";

interface Props {
  pathname: string;
}
const UserManagementLink: React.FunctionComponent<Props> = ({
  pathname,
}) => {
  const canManageUsers = useSelector((state: ApplicationState) =>
    authSelectors.getHasTag(state, GroupTag.USER_MANAGEMENT),
  );

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
