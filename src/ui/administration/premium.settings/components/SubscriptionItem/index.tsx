import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import React, { MouseEvent } from 'react';
import { isTranslationExists, translate } from '../../../../../common/intl';
import useHover from '../../../../hooks/useHover';
import SwitchControl from '../../../general.settings/components/SwitchControl';
import useStyles from './styles';
import { SubscriptionItemProps } from './types';

const SubscriptionItem: React.FC<SubscriptionItemProps> = ({
  subscription,
  onToggle,
}) => {
  const classes = useStyles();
  const [hoverRef, isHover] = useHover();

  const key = subscription.premiumFeature.toLowerCase().replaceAll('_', '.');

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
      label={
        <>
          <div>
            <div className={classes.subscriptionTitle}>
              {translate(`administration.premium.features.${key}.title`)}
            </div>
            <div className={classes.subscriptionDescription}>
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
