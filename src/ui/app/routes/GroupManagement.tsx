import React from "react";
import { GroupTag } from "../../../state/ducks/auth/types";
import { GROUP_MANAGEMENT_ROOT_URL } from "../../constants/urls";
import useGetHasTag from "../../hooks/useGetHasTag";
import NavigationLinkContainer from "../NavigationLink.container";

interface Props {
  pathname: string;
}

// TODO: remove this component ones navigation configuration is implemented
const GroupManagementLink: React.FunctionComponent<Props> = ({
  pathname,
}) => {
  const canManageGroups = useGetHasTag(GroupTag.GROUP_MANAGEMENT);

  if (!canManageGroups) {
    return null;
  }

  return (
    <NavigationLinkContainer
      link={GROUP_MANAGEMENT_ROOT_URL}
      label="navigation.group.management"
      currentPath={pathname}
      type="LINK"
    />
  );
};

export default GroupManagementLink;
