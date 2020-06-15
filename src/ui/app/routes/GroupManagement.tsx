import React from "react";
import { GroupTag } from "../../../state/ducks/auth/types";
import { GROUP_MANAGEMENT_ROOT_URL } from "../../constants/urls";
import useGetHasTag from "../../hooks/useGetHasTag";
import NavigationLinkContainer from "../NavigationLink.container";

interface Props {
  pathname: string;
}
const GroupManagementLink: React.FunctionComponent<Props> = ({
  pathname,
}) => {
  const canManageGroups = useGetHasTag(GroupTag.GROUP_MANAGEMENT);

  if (!canManageGroups) {
    return null;
  }

  return (
    <NavigationLinkContainer
      url={GROUP_MANAGEMENT_ROOT_URL}
      text="navigation.group.management"
      data-cy="Navigation.group.management"
      currentPath={pathname}
    />
  );
};

export default GroupManagementLink;
