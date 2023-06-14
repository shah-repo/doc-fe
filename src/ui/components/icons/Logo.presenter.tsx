import React from 'react';
import { theme } from '../../../common/utils/helpers';
import Text from '../../components/Text';
import styles from './Logo.styles';

interface Props {
  logo: string
  showEnvironment: boolean
}

const Logo: React.FunctionComponent<Props> = ({
  logo,
  showEnvironment,
}) => {
  const classes = styles();
  const themeBgClass = theme.toLowerCase().replace(/(_)/g, '');
  return (
    <React.Fragment>
      {showEnvironment && (
        <div className={`${classes.envCnt} ${classes[themeBgClass]}`}>
          <span className={classes.evnTxt}>
            <Text message={`environment.${theme}`} />
          </span>
        </div>
      )}
      <img
        id="logo"
        src={logo}
        style={{ marginTop: showEnvironment ? 0 : 20 }}
        className={classes.logo}
        alt="Company logo"
      />
    </React.Fragment>
  );
};

export default Logo;
