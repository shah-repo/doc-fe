import { chain, filter, findIndex, isEmpty } from "lodash";

export const orderByLockedState = (
  columnDefinitions: any,
  groupableFields: string[]
) =>
{
  const isGroupable = (field: string) => groupableFields.includes(field);
  const sortedColumnDefinitions = chain([...columnDefinitions])
    .orderBy(["locked"], ["desc"])
    .map((column) => {
      column.reorderable = !column.locked;
      column.sortable = !column.locked;
      column.orderIndex = column.locked ? 0 : column.orderIndex;
      column.groupable = column.locked ? !column.locked : isGroupable(column.field);
      column.disabled = false;
      return column;
    })
    .value();
  const hiddenColumns = filter(sortedColumnDefinitions, { show: false }).length;
  if (hiddenColumns === sortedColumnDefinitions.length - 1) {
    const indexOfObject =  findIndex(sortedColumnDefinitions, ["show", true]);
    sortedColumnDefinitions[indexOfObject].disabled = true;
  }
  return sortedColumnDefinitions;
};

/**
 * Entity schema for the group entity. Along with the required field to identify the entity,
 */
/*
const columnSchema = new schema.Entity("columns", {}, { idAttribute: "field" });
const filterentity = new schema.Entity("filter", {}, { idAttribute: "field" });
const group = new schema.Entity("group");
const filters = { filters: [filterentity] };
const groups = { groups: [group] };
const kendoConfigSchema = new schema.Object({ filter: filters, groups });
*/

/**
  * To normalize data, we need to define a schema for the data we want to normalize.
  * @param data
  * @returns [normalizedData, result, normalizedEntities]
  */
/* export const getColumnNormalizedData = (data) => {
  const normalizedData = normalize(data, [columnSchema]);
  return normalizedData;
}; */

/**
  * To denormalize data, we need to define a schema for the data we want to denormalize.
  * And we need to pass the normalized data to denormalize.
  * @param normalizedData - [normalizedData, result, normalizedEntities]
  * @returns [denormalizedData]
  */
/* export const getColumnDenormalizedData = (result, entities) => {
  const denormalizedData = denormalize(result, [columnSchema], entities);
  return denormalizedData;
}; */

/**
   * To normalize data, we need to define a schema for the data we want to normalize.
   * @param data
   * @returns [normalizedData, result, normalizedEntities]
   */
/* export const getFilterNormalizedDData = (data) => {
  const normalizedData = normalize(data, kendoConfigSchema);
  return normalizedData;
}; */

/**
   * To denormalize data, we need to define a schema for the data we want to denormalize.
   * And we need to pass the normalized data to denormalize.
   * @param normalizedData - [normalizedData, result, normalizedEntities]
   * @returns [denormalizedData]
   */
/* export const getFilterDenormalizedDData = (result, entities) => {
  const denormalizedData = denormalize(result,
    kendoConfigSchema, entities);
  return denormalizedData;
}; */

/**
 * To calculate and set column width
 * If it is below 100% then it will be calculated considering the grid width given
 * or else it will be same as column width
 * @param columnWidth
 * @param gridWidth
 * @return [newColumnWidth]
 */
export const setColumnWidth = (columnWidth: number, gridWidth: number) => {
  if (columnWidth < 100) {
    return (gridWidth / 100) * columnWidth;
  }
  return columnWidth;
};

/**
 * To hide the column title on mouse while resizing the grid
 */
export const hideColumnTitleOnResize = () => {
  const selector: any = document.querySelector(".k-drag-clue");
  if (!isEmpty(selector)) {
    selector.style.display = "none";
  }
};
