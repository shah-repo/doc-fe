import { chain } from "lodash";
import { denormalize, normalize, schema } from "normalizr";

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
      return column;
    })
    .value();
  return sortedColumnDefinitions;
};

/**
 * Entity schema for the group entity. Along with the required field to identify the entity,
 */
const columnSchema = new schema.Entity("columns", {}, { idAttribute: "field" });

/**
 * To normalize data, we need to define a schema for the data we want to normalize.
 * @param data
 * @returns [normalizedData, result, normalizedEntities]
 */
export const getNormalizedData = (data) => {
  const normalizedData = normalize(data, [columnSchema]);
  return normalizedData;
};

/**
 * To denormalize data, we need to define a schema for the data we want to denormalize.
 * And we need to pass the normalized data to denormalize.
 * @param normalizedData - [normalizedData, result, normalizedEntities]
 * @returns [denormalizedData]
 */
export const getDenormalizedData = (result, entities) => {
  const denormalizedData = denormalize(result, [columnSchema], entities);
  return denormalizedData;
};
