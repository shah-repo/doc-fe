import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { kebabCase } from 'lodash';
import React, { MouseEvent } from 'react';
import { isTranslationExists, translate } from '../../../../../common/intl';
import useHover from '../../../../hooks/useHover';
import SwitchControl from '../../../general.settings/components/SwitchControl';
import useStyles from './styles';
import { SubscriptionItemProps } from './types';

const SubscriptionItem: React.FC<SubscriptionItemProps> = ({
  isDisabled,
  subscription,
  onToggle,
}) => {
  const classes = useStyles();
  const [hoverRef, isHover] = useHover();

  const key = subscription.premiumFeature.toLowerCase().replaceAll('_', '.');
  const featureName = kebabCase(subscription.premiumFeature);

  const infoText = isTranslationExists(`administration.premium.features.${key}.info`)
    ? translate(`administration.premium.features.${key}.info`)
    : translate('administration.premium.features.default.info');

  return (
    <SwitchControl
      onChange={(e, checked) => onToggle(checked, subscription)}
      labelProps={{
        className: classes.togglerContainer,
        classes: {
          label: classes.togglerLabel,
        },
        onClick: (e: MouseEvent<HTMLLabelElement>) => e.preventDefault(),
      }}
      checked={subscription.isEnabled}
      className={classes.toggler}
      data-cy={`administration-pfo-feature-${featureName}-toggler`}
      disabled={!isDisabled}
      label={
        <>
          <div>
            <div data-cy={`administration-pfo-feature-${featureName}-title`} className={classes.subscriptionTitle}>
              {translate(`administration.premium.features.${key}.title`)}
            </div>
            <div data-cy={`administration-pfo-feature-${featureName}-desc`} className={classes.subscriptionDescription}>
              {translate(`administration.premium.features.${key}.description`)}
            </div>
          </div>
          <Tooltip
            title={infoText}
            arrow
            placement="right"
            className={classes.subscriptionInfo}
          >
            <span ref={hoverRef}>
              <FontAwesomeIcon
                className={classes.infoIcon}
                data-cy={`administration-pfo-feature-${featureName}-info-icon`}
                icon={isHover ? solid('circle-info') : regular('circle-info')}
              />
            </span>
          </Tooltip>
        </>
      }
    />
  );
};

export default SubscriptionItem;
