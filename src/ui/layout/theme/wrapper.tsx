import { MuiThemeProvider } from '@material-ui/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { companySelectors } from '../../../state/ducks/company';
import theme from './generator';

const LegacyThemeWrapper: React.FC = ({
  children,
}) => {
  const whiteLabeling = useSelector(companySelectors.getWhiteLabeling);

  return (
    <MuiThemeProvider theme={theme(whiteLabeling.colors)}>
      {children}
    </MuiThemeProvider>
  );
};

export default LegacyThemeWrapper;
