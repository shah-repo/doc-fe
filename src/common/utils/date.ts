import moment, { MomentInput } from 'moment';
import 'moment-timezone';
import { MyFeedsItems } from '../../state/ducks/dashboard.new/my.feeds/types';

export const TIME_ZONE = 'America/Los_Angeles';

type DateTypes = MomentInput | Date | string | number | undefined;

export const getStartOfDayDateString = (date: DateTypes, format = '') =>
  moment(date).tz(TIME_ZONE).startOf('day').format(format);

export const getSortedLineItems = (data: MyFeedsItems[]): MyFeedsItems[] =>
  data?.sort((a, b) => moment(a.timestamp).diff(moment(b.timestamp))).reverse();

export const toStartOfDay = (date: DateTypes) =>
  new Date(
    ...(moment.utc(date).toArray().slice(0, 3) as [number, number, number]),
  );

export const getFormattedStartOfDayDateString = (date: DateTypes) =>
  getStartOfDayDateString(date, 'LL');

export const getFormattedDateString = (date: DateTypes, format = '') =>
  moment(date).tz(TIME_ZONE).format(format);

export const getHumanizedFormat = (dateString: string) => moment.utc(dateString).local().startOf('seconds').fromNow();

export const getCurrentDate = (format: string) => moment().tz(TIME_ZONE).format(format);

export const getFormattedUTCDate = (date: DateTypes, format = '') =>
  moment(date).format(format);

export enum MomentFormats {
  MonthDateYear = 'M/D/YYYY',
  MonthDateYearTwoDigit = 'MM/DD/YYYY',
  MonthDateYearAlt = 'MMMM D, YYYY',
  DateTime = 'MMMM D, YYYY hh:mm A z',
  BriefDate = 'MMM D, YYYY',
  ShortBriefDate = 'MMM D',
  BriefDateTime = 'MMM D, YYYY hh:mm A z',
  DateTimeAlt = 'D MMM YYYY hh:mm a z',
  DateTimeComplete = 'M/D/YYYY hh:mm A z',
  DayMonthDateYear = 'ddd MMMM D YYYY',
  DayMonthDateYearAlt = 'ddd, MMMM D, YYYY',
  DateTimeSeconds = 'M/D/YYYY hh:mm:ss A z',
  Time = 'hh:mm:ss A z',
  AsyncTasksDefaultDateTimeFormatter = 'YYYY-MM-DDTHH:mm:ss z',
  YearMonthDateDotNotation = 'YYYY.MM.DD',
  YearMonthDate= 'YYYY-MM-DD',
  FullDateTime = 'dddd, MMMM DD, YYYY hh:mm A',
}

export const toValidateIfDate = (value: moment.MomentInput) => moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid();
export const validateDateFormats = (date: string, formats: string[]): boolean => {
  return formats.some(fmt => moment(date, fmt, true).isValid());
};
