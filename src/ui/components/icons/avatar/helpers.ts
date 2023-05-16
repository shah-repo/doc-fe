export const getInitalsFromName = (name: string) => {
  const array = name.replace(/\s\s+/g, ' ').split(' ');
  return array.length <= 1
    ? name.charAt(0) + name.charAt(1)
    : array[0].charAt(0) + array[1].charAt(0);
};
