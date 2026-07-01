import React from 'react';
import { logoThumb, theme } from '../../../common/utils/helpers';
import Config from '../../../config';
import { WhiteLabelingEnv } from '../../../state/ducks/company/types';
import { store } from '../../../state/store';
import Text from '../../components/Text';
import { ThemeEnv } from '../../layout/theme/utils/types';
import styles from './Logo.styles';

interface Props {
  logo: string
  shouldShowEnvironment: boolean
  isOpen: boolean
}

const Logo: React.FunctionComponent<Props> = ({
  logo,
  shouldShowEnvironment,
  isOpen,
}) => {
  const user = store.getState().auth.user;
  const companyName = user.employee.company.name;
  const classes = styles({ initialColor: user.initialColor });
  const themeBgClass = theme.toLowerCase().replace(/(_)/g, '');
  const whiteLabeling = ((user.employee.company.whiteLabeling || {})[Config.Theme as ThemeEnv] || {}) as WhiteLabelingEnv;
  return (
    <React.Fragment>
      {shouldShowEnvironment && (
        <div className={`${classes.envCnt} ${classes[themeBgClass]}`}>
          <span className={classes.evnTxt}>
            <Text
              message={
                isOpen ? `environment.${theme}` : `environment.${theme}.short`
              }
            />
          </span>
        </div>
      )}
      {!isOpen && (
        <div className={classes.smallLogoContainer} data-cy={companyName}>
          <img
            id="logo"
            className={classes.avatar}
            src={whiteLabeling.avatar || logoThumb}
            alt={companyName}
          />
        </div>
      )}
      {isOpen && (
        <div data-cy={companyName}>
          <img
            id="logo"
            src={logo}
            className={classes.logo}
            alt={companyName}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default Logo;
