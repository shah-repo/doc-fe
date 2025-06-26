/**
 * Updates a nested object immutably.
 * @param obj - The original object.
 * @param key - The key whose value (nested object) needs to be updated.
 * @param updates - The updates to apply to the nested object.
 * @returns A new object with the updates applied.
 */
export function updateNestedObject<T extends Record<string, any>, K extends keyof T> (
  obj: T,
  key: K,
  updates: Partial<T[K]>,
): T {
  return {
    ...obj, // Spread the original object to create a new one
    [key]: {
      ...obj[key], // Spread the existing nested object
      ...updates, // Apply updates to the nested object
    },
  };
}
