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
  MonthDateYear = "M/D/YYYY",
  MonthDateYearTwoDigit = "MM/DD/YYYY",
  MonthDateYearAlt = "MMMM D, YYYY",
  DateTime = "MMMM D, YYYY hh:mm A z",
  BriefDate = "MMM D, YYYY",
  ShortBriefDate = "MMM D",
  BriefDateTime = "MMM D, YYYY hh:mm A z",
  DateTimeAlt = "D MMM YYYY hh:mm a",
  DateTimeComplete = "M/D/YYYY hh:mm A z",
  DayMonthDateYear = "ddd MMMM D YYYY",
  DayMonthDateYearAlt = "ddd, MMMM D, YYYY",
  DateTimeSeconds = "M/D/YYYY hh:mm:ss A z",
  Time = "hh:mm:ss A z",
  AsyncTasksDefaultDateTimeFormatter = "YYYY-MM-DDTHH:mm:ss z",
  YearMonthDateDotNotation = "YYYY.MM.DD",
  YearMonthDate= "YYYY-MM-DD"
}

export const toValidateIfDate = (value: moment.MomentInput) => moment(value, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid();
