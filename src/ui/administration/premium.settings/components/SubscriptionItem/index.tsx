import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../../common/intl';
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

  const key = subscription.type.toLowerCase();

  return (
    <SwitchControl
      onChange={(e, checked) => onToggle(checked, subscription)}
      labelProps={{
        className: classes.togglerContainer,
        classes: {
          label: classes.togglerLabel,
        },
      }}
      checked={subscription.isEnabled}
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
            title={translate('administration.premium.features.info')}
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
