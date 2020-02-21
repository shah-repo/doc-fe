import React from "react";
import { useSelector } from "react-redux";
import { getHasTag } from "../../../common/utils/selectors";
import { GroupTag } from "../../../state/ducks/auth/types";
import { GROUP_MANAGEMENT_ROOT_URL } from "../../constants/urls";
import NavigationLinkContainer from "../NavigationLink.container";

interface Props {
  pathname: string;
}
const GroupManagementLink: React.FunctionComponent<Props> = ({
  pathname,
}) => {
  const canManageGroups = useSelector(getHasTag(GroupTag.GROUP_MANAGEMENT));

  if (!canManageGroups) {
    return null;
  }

  return (
    <NavigationLinkContainer
        url={GROUP_MANAGEMENT_ROOT_URL}
        text="navigation.group.management"
        currentPath={pathname}
    />
  );
};

export default GroupManagementLink;
