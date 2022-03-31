import { map, sortBy } from "lodash";
import { ACTION_TITLE_MAPPIING } from "../../../state/ducks/userManagement/types";

export const addUserNameAndEmailBlock = (sameGroup, employeeDetails) => {
  const auditTypes = map(sameGroup, "auditType");
  if (
    auditTypes.includes(ACTION_TITLE_MAPPIING.AddedToGroups) ||
    auditTypes.includes(ACTION_TITLE_MAPPIING.AddedToGroup) ||
    auditTypes.includes(ACTION_TITLE_MAPPIING.DeletedFromGroups)
  ) {
    sameGroup.unshift({
      primaryText: "Added User Email",
      secondayText: employeeDetails.user.email,
      sortedIndex: 2,
    });
    if (!auditTypes.includes(ACTION_TITLE_MAPPIING.CreatedNewUser)) {
      sameGroup.unshift({
        primaryText: "Added User Name",
        secondayText: employeeDetails.user.name,
        sortedIndex: 1,
      });
    }
  }
  return sortBy(sameGroup, "sortedIndex");
};
