import moment from "moment-timezone";

const TIME_ZONE = "America/Los_Angeles";

type DateTypes = Date | string | number | undefined;

export const getStartOfDayDateString = (date: DateTypes, format: string = "") => {
  return moment(date).tz(TIME_ZONE).startOf("day").format(format);
};

export const toStartOfDay = (date: DateTypes) => {
  return moment(date).tz(TIME_ZONE).startOf("day").toDate();
};

export const getFormattedStartOfDayDateString = (date: DateTypes) => getStartOfDayDateString(date, "LL");
