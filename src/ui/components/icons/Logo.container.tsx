import React from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../../../common/utils/helpers';
import { companySelectors } from '../../../state/ducks/company';
import { ThemeEnv } from '../../layout/theme/utils/types';
import Logo from './Logo.presenter';

const LogoContainer: React.FunctionComponent = () => {
  const whiteLabeling = useSelector(companySelectors.getWhiteLabeling);
  const showEnvironment
    = theme === ThemeEnv.DEV_THEME
    || theme === ThemeEnv.DEMO_THEME
    || theme === ThemeEnv.SANDBOX_THEME;
  const navigationLogo = whiteLabeling.logo || '/logo_enlil.svg';
  return <Logo logo={navigationLogo} showEnvironment={showEnvironment} />;
};

export default LogoContainer;
