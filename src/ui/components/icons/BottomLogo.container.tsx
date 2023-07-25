import React from 'react';
import { useSelector } from 'react-redux';
import { companySelectors } from '../../../state/ducks/company';
import Text from '../Text';
import styles from './BottomLogo.styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BottomLogoContainer: React.FunctionComponent = () => {
  const classes = styles();
  const whiteLabeling = useSelector(companySelectors.getWhiteLabeling);

  if (!whiteLabeling.logo) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Text translation="common.powered.by" />
      <img
        src="/logo_enlil.svg"
        className={classes.logo}
        alt="Enlil logo"
      />
    </div>
  );
};

// export default BottomLogoContainer;
