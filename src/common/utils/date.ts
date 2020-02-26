import moment from "moment-timezone";

export const TIME_ZONE = "America/Los_Angeles";

type DateTypes = Date | string | number | undefined;

export const getStartOfDayDateString = (date: DateTypes, format = "") => moment(date).tz(TIME_ZONE, true).startOf("day").format(format);

export const toStartOfDay = (date: DateTypes) => moment(date).tz(TIME_ZONE, true).startOf("day").toDate();

export const getFormattedStartOfDayDateString = (date: DateTypes) => getStartOfDayDateString(date, "LL");
