
export const maskId = (id: number) => {
  const idStr = "" + id;
  const pad = "0000";
  return pad.substring(0, pad.length - idStr.length) + idStr;
};

export const unmaskId = (id: string) => {
  const filteredID = Number(id.replace(/\D/g, ""));
  if (filteredID === 0) {
    return "";
  }
  return filteredID.toString();
};
