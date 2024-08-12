import { translate } from '../../../../../common/intl';
import { NotifyPartLCP } from '../../../../../state/ducks/company/types';

export const DEFAULT_OPTION_MARKUP = '(default)';
export const EXPIRED_LOTS_KEY = 'allocationConfig.expiredLotsPrompt';
export const NOTIFY_PART_LCP_KEY = 'shouldNotifyLcpMismatch';
export const OPTIONS = [
  { label: translate('administration.general.settings.expired.lots.dropdown.option.doNothing'), value: NotifyPartLCP.DO_NOTHING },
  { label: translate('administration.general.settings.expired.lots.dropdown.option.warning'), value: NotifyPartLCP.WARNING },
  { label: translate('administration.general.settings.expired.lots.dropdown.option.error'), value: NotifyPartLCP.ERROR },
];
