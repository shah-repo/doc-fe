import { map, sortBy } from "lodash";
import { ACTION_TITLE_MAPPING } from "../../../state/ducks/userManagement/types";

export const addUserNameAndEmailBlock = (sameGroup, employeeDetails) => {
  const auditTypes = map(sameGroup, "auditType");
  if (
    auditTypes.includes(ACTION_TITLE_MAPPING.AddedToGroups) ||
    auditTypes.includes(ACTION_TITLE_MAPPING.AddedToGroup) ||
    auditTypes.includes(ACTION_TITLE_MAPPING.DeletedFromGroups)
  ) {
    sameGroup.unshift({
      primaryText: "Added User Email",
      secondaryText: employeeDetails.user.email,
      sortedIndex: 2,
    });
    if (!auditTypes.includes(ACTION_TITLE_MAPPING.CreatedNewUser)) {
      sameGroup.unshift({
        primaryText: "Added User Name",
        secondaryText: employeeDetails.user.name,
        sortedIndex: 1,
      });
    }
  }
  return sortBy(sameGroup, "sortedIndex");
};
