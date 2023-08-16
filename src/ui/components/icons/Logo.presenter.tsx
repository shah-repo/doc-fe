import cx from 'classnames';
import React from 'react';
import { ReactComponent as CompanyAvatar } from '../../../assets/images/company_avatar.svg';
import { theme } from '../../../common/utils/helpers';
import Config from '../../../config';
import { WhiteLabelingEnv } from '../../../state/ducks/company/types';
import { store } from '../../../state/store';
import Text from '../../components/Text';
import { ThemeEnv } from '../../layout/theme/utils/types';
import styles from './Logo.styles';

interface Props {
  logo: string
  showEnvironment: boolean
  open: boolean
}

const Logo: React.FunctionComponent<Props> = ({
  logo,
  showEnvironment,
  open,
}) => {
  const user = store.getState().auth.user;
  const companyName = user.employee.company.name;
  const classes = styles({ initialColor: user.initialColor });
  const themeBgClass = theme.toLowerCase().replace(/(_)/g, '');
  const whiteLabeling = ((user.employee.company.whiteLabeling || {})[Config.Theme as ThemeEnv] || {}) as WhiteLabelingEnv;
  return (
    <React.Fragment>
      {showEnvironment && (
        <div className={`${classes.envCnt} ${classes[themeBgClass]}`}>
          <span className={classes.evnTxt}>
            <Text message={open ? `environment.${theme}` : `environment.${theme}.short`} />
          </span>
        </div>
      )}
      {!open && <div className={classes.smallLogoContainer} data-cy={companyName}>
        {whiteLabeling.avatar && <img
          id="logo"
          className={classes.avatar}
          src={whiteLabeling.avatar}
        />}
        {!whiteLabeling.avatar && <CompanyAvatar />}
      </div>}
      {open && <div data-cy={companyName}>
        <img
          id="logo"
          src={logo}
          className={cx(classes.logo, { [classes.mt0]: showEnvironment, [classes.mt20]: !showEnvironment })}
          alt={companyName}
        /></div>}
    </React.Fragment>
  );
};

export default Logo;
