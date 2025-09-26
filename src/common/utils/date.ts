import { isEmpty } from 'lodash';
import moment, { MomentInput } from 'moment';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../state/ducks/auth';
import { MyFeedsItems } from '../../state/ducks/dashboard.new/my.feeds/types';

export const TIME_ZONE = 'America/Los_Angeles';

export const useDate = () => {
  const defaultUserCompanyTimeZone = useSelector(authSelectors.getUserCompanyTimezone);
  const timezone = isEmpty(defaultUserCompanyTimeZone) ? TIME_ZONE : defaultUserCompanyTimeZone;
  moment?.tz?.setDefault(timezone);

  const getFormattedDateString = (date: DateTypes, format = '') =>
    moment(date)?.tz(timezone)?.format(format);

  const getStartOfDayDateString = (date: DateTypes, format = '') =>
    moment(date).tz(timezone).startOf('day').format(format);

  const getFormattedStartOfDayDateString = (date: DateTypes) =>
    getStartOfDayDateString(date, 'LL');

  const getCurrentDate = (format: string) => moment().tz(timezone).format(format);

  const convertDateTimeToUserTz = (date: string, format: string): string => {
    return moment.tz(date, format, timezone).format(MomentFormats.YearMonthDateDash);
  };

  const formatDisplayDate = (dateStr?: string, format = MomentFormats.MonthDateYearTwoDigit) => {
    if (!dateStr) {
      return dateStr;
    }

    const isYMDFormat = moment(dateStr, MomentFormats.YearMonthDateDash, true).isValid();
    const isISODateTime = moment.utc(dateStr, moment.ISO_8601, true).isValid();

    if (isYMDFormat) {
      return moment.utc(dateStr, MomentFormats.YearMonthDateDash).format(format);
    }

    if (isISODateTime) {
      return moment.utc(dateStr).format(format);
    }

    return dateStr;
  };

  return {
    timezone,
    getCurrentDate,
    convertDateTimeToUserTz,
    getFormattedDateString,
    getStartOfDayDateString,
    getFormattedStartOfDayDateString,
    formatDisplayDate,
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
  YearMonthDateDash = 'YYYY-MM-DD',
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
