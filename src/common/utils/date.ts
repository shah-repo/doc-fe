import moment from "moment";
import "moment-timezone";

export const TIME_ZONE = "America/Los_Angeles";

type DateTypes = Date | string | number | undefined;

export const getStartOfDayDateString = (date: DateTypes, format = "") => moment(date).tz(TIME_ZONE, true).startOf("day").format(format);

export const toStartOfDay = (date: DateTypes) => new Date(...moment.utc(date).toArray().slice(0, 3) as [number, number, number]);

export const getFormattedStartOfDayDateString = (date: DateTypes) => getStartOfDayDateString(date, "LL");

export const getFormattedDateString = (date: DateTypes, format = "") => moment(date).tz(TIME_ZONE).format(format);

export enum MomentFormats {
  MonthDateYear = "M/D/YYYY",
  MonthDateYearAlt =  "MMMM D, YYYY",
  DateTime = "MMMM D, YYYY HH:mm A",
  DateTimeAlt = "D MMM YYYY hh:mm a",
  DateTimeComplete = "M/D/YYYY hh:mm A",
}
