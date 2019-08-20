import moment from "moment-timezone";

const TIME_ZONE = "America/Los_Angeles";

type DateTypes = Date | string | undefined;

export const getDateString = (date: DateTypes, format: string = "") => {
  return moment(date).tz(TIME_ZONE).startOf("day").format(format);
}

export const applyTimezoneToDate = (date: DateTypes) => {
  return new Date(moment(date).tz(TIME_ZONE).startOf("day").format());
}

export const getFormattedDateString = (date: DateTypes) => getDateString(date, "LL");