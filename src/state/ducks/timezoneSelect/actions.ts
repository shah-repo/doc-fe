import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { FETCH_TIMEZONE, TIMEZONE } from './constants';

const fetchTimezonesList = (handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: TIMEZONE,
    method: 'get',
    handlers,
  });

const fetchTimezone = (timezone: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${FETCH_TIMEZONE}/?name=${timezone}`,
    method: 'get',
    handlers,
  });

export default {
  fetchTimezonesList,
  fetchTimezone,
};
