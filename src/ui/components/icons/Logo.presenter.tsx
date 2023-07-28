import { Avatar } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { theme } from '../../../common/utils/helpers';
import { store } from '../../../state/store';
import Text from '../../components/Text';
import { getInitalsFromName } from './avatar/helpers';
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
  return (
    <React.Fragment>
      {showEnvironment && (
        <div className={`${classes.envCnt} ${classes[themeBgClass]}`}>
          <span className={classes.evnTxt}>
            <Text message={open ? `environment.${theme}` : `environment.${theme}.short`} />
          </span>
        </div>
      )}
      {!open && <Avatar className={classes.avatar} data-cy={companyName}>
        {getInitalsFromName(companyName)}
      </Avatar>}
      {open && <div className={classes.logoContainer} data-cy={companyName}>
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
