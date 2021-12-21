import { chain } from "lodash";

export const orderByLockedState = (
  columnDefinitions: any,
  groupableFields: string[]
) =>
{
  const isGroupable = (field: string) => groupableFields.includes(field);
  const sortedColumnDefinitions = chain([...columnDefinitions])
    .orderBy([{ field: "locked", dir: "desc" }])
    .map((column) => {
      column.reorderable = !column.locked;
      column.sortable = !column.locked;
      column.orderIndex = column.locked ? 0 : column.orderIndex;
      column.groupable = column.locked ? !column.locked : isGroupable(column.field);
      return column;
    })
    .value();
  return sortedColumnDefinitions;
};
