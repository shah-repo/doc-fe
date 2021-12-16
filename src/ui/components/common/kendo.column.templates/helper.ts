import moment from "moment";

export const toValidateIfDate = (value) => moment(value, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid();
