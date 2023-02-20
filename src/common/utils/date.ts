import moment from "moment";
import "moment-timezone";

export const TIME_ZONE = "America/Los_Angeles";

type DateTypes = Date | string | number | undefined;

export const getStartOfDayDateString = (date: DateTypes, format = "") =>
  moment(date).tz(TIME_ZONE).startOf("day").format(format);

export const toStartOfDay = (date: DateTypes) =>
  new Date(
    ...(moment.utc(date).toArray().slice(0, 3) as [number, number, number])
  );

export const getFormattedStartOfDayDateString = (date: DateTypes) =>
  getStartOfDayDateString(date, "LL");

export const getFormattedDateString = (date: DateTypes, format = "") =>
  moment(date).tz(TIME_ZONE).format(format);

export const getHumanizedFormat = (dateString: string) => moment.utc(dateString).local().startOf("seconds").fromNow();

export const getCurrentDate = (format: string) => moment().tz(TIME_ZONE).format(format);

export enum MomentFormats {
  MonthDateYear = "M/D/YYYY z",
  MonthDateYearTwoDigit = "MM/DD/YYYY z",
  MonthDateYearAlt = "MMMM D, YYYY z",
  DateTime = "MMMM D, YYYY hh:mm A z",
  BriefDate = "MMM D, YYYY z",
  ShortBriefDate = "MMM D z",
  BriefDateTime = "MMM D, YYYY hh:mm A z",
  DateTimeAlt = "D MMM YYYY hh:mm a z",
  DateTimeComplete = "M/D/YYYY hh:mm A z",
  DayMonthDateYear = "ddd MMMM D YYYY z",
  DayMonthDateYearAlt = "ddd, MMMM D, YYYY z",
  DateTimeSeconds = "M/D/YYYY hh:mm:ss A z",
  Time = "hh:mm:ss A z",
  AsyncTasksDefaultDateTimeFormatter = "YYYY-MM-DDTHH:mm:ss z",
  YearMonthDateDotNotation = "YYYY.MM.DD z",
  YearMonthDate= "YYYY-MM-DD z"
}

export const toValidateIfDate = (value: moment.MomentInput) => moment(value, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid();
