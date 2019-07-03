
export const maskId = (id: number) => {
  const idStr = "" + id;
  const pad = "0000";
  return pad.substring(0, pad.length - idStr.length) + idStr;
};
