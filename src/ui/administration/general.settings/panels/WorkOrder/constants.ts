import { translate } from '../../../../../common/intl';

export const DEFAULT_OPTION_MARKUP = '(default)';
export const OPTIONS = [
  { label: translate('administration.general.settings.expired.lots.dropdown.option.doNothing'), value: 'DO_NOTHING' },
  { label: translate('administration.general.settings.expired.lots.dropdown.option.warning'), value: 'WARNING' },
  { label: translate('administration.general.settings.expired.lots.dropdown.option.error'), value: 'ERROR' },
];
