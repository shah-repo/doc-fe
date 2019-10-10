import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import * as React from "react";
import { useSelector } from "react-redux";
import { companySelectors } from "../../../state/ducks/company";
import theme from "./generator";

const Theme: React.FunctionComponent = ({
  children,
}) => {
  const whiteLabeling = useSelector(companySelectors.getWhiteLabeling);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default Theme;
