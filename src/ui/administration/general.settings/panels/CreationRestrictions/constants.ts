export const EDIT_FIELDS = ['restrictedToUsers_edit', 'restrictedToRoles_edit'];

export const toSortedOptions = <T>(
  items: T[],
  getId: (item: T) => string,
  getText: (item: T) => string,
  getExtra?: (item: T) => Record<string, unknown>,
) =>
  items
    .slice()
    .sort((a, b) =>
      getText(a).localeCompare(
        getText(b),
        undefined,
        { sensitivity: 'base' },
      ),
    )
    .map((item) => ({
      id: getId(item),
      text: getText(item),
      ...(getExtra?.(item) ?? {}),
    }));
