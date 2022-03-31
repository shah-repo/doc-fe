import { sortBy } from "lodash";

export const addUserNameAndEmailBlock = (sameGroup) => {
  const pt = sameGroup.map((d) => d.primaryText);
  if (pt.includes("Added To Groups") || pt.includes("Added To Group") || pt.includes("Removed from Groups")) {
    sameGroup.unshift({ primaryText: "Added User Email", secondayText: "Shiv@enlil.com", sortedIndex: 2  });
    if (!pt.includes("Added New User")) {
      sameGroup.unshift({ primaryText: "Added User Name", secondayText: "Shiv", sortedIndex: 1 });
    }
  }
  return sortBy(sameGroup, "sortedIndex");
};
