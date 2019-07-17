
export const unmaskId = (id: string) => {
  const filteredID = Number(id.replace(/\D/g, ""));
  if (filteredID === 0) { return ""; }
  return filteredID.toString();
};
