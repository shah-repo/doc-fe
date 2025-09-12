import moment, { MomentInput } from 'moment';
import * as momentTz from 'moment-timezone';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../state/ducks/auth';
import { MyFeedsItems } from '../../state/ducks/dashboard.new/my.feeds/types';

export const TIME_ZONE = 'America/Los_Angeles';

export const useDate = () => {
  const timezone = useSelector(authSelectors.getUserTimezone);
  momentTz.tz.setDefault(timezone);

  const getFormattedDateString = (date: DateTypes, format = '') =>
    moment(date)?.tz(timezone)?.format(format);

  const getFormattedStartOfDayDateString = (date: DateTypes) =>
    getFormattedDateString(date, 'LL');

  const getCurrentDate = (format?: string) => moment().tz(timezone).format(format);

  const convertDateTimeToUserTz = (date: string, format: string): string => {
    return moment.tz(date, format, timezone).toISOString();
  };

  return {
    timezone,
    getCurrentDate,
    convertDateTimeToUserTz,
    getFormattedDateString,
    getFormattedStartOfDayDateString,
  };
};

type DateTypes = MomentInput | Date | string | number | undefined;

export const getSortedLineItems = (data: MyFeedsItems[]): MyFeedsItems[] =>
  data?.sort((a, b) => moment(a.timestamp).diff(moment(b.timestamp))).reverse();

export const toStartOfDay = (date: DateTypes) =>
  new Date(
    ...(moment.utc(date).toArray().slice(0, 3) as [number, number, number]),
  );

export const getHumanizedFormat = (dateString: string) => moment.utc(dateString).local().startOf('seconds').fromNow();

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
