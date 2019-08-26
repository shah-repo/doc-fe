import _ from "lodash";

export const getAuditDefaultValue = (nextValue: any) => {
  if (_.isString(nextValue))
    return nextValue;
  
  return "N/A";
}