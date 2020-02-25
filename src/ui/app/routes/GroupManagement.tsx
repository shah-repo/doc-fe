import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { GroupTag } from "../../../state/ducks/auth/types";
import { ApplicationState } from "../../../state/reducers";
import { GROUP_MANAGEMENT_ROOT_URL } from "../../constants/urls";
import NavigationLinkContainer from "../NavigationLink.container";

interface Props {
  pathname: string;
}
const GroupManagementLink: React.FunctionComponent<Props> = ({
  pathname,
}) => {
  const selectCanManageGroups = React.useMemo(() => authSelectors.makeGetHasTag(), []);
  const canManageGroups = useSelector(
    (state: ApplicationState) => selectCanManageGroups(state, GroupTag.GROUP_MANAGEMENT)
  );

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
