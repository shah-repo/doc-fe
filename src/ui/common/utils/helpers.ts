import _ from "lodash";

/**
 * Return nextValue only if string, otherwise it will crash FE
 * @param {any} nextValue Any audit type
 * @returns {string} nextValue if string, otherwise returns "N/A"
 */
export const getAuditDefaultValue = (nextValue: any): string => {
  if (_.isString(nextValue)) {
    return nextValue;
  }
  
  return "N/A";
}
