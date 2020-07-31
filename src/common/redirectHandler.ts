export const redirectTo = (url: string): (() => any) => () => {
  window.location.href = url;
  return null;
};
