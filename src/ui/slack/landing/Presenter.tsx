import { Box } from "@material-ui/core";
import React from "react";
import { ReactComponent as SlackLogo } from "../../../assets/images/slack_full_logo.svg";
import { logo } from "../../../common/utils/helpers";
import SlackLandingError from "./Error";
import SlackLandingProgress from "./Progress";
import { styles } from "./styles";
import SlackLandingSuccess from "./Success";

interface Props {
  successMessage: string;
  errorMessage: string;
  onCounterFinish: () => void;
  goToDashboard: () => void;
  retry: () => void;
}

const SlackLandingPresenter: React.FunctionComponent<Props> = ({
  successMessage,
  errorMessage,
  onCounterFinish,
  goToDashboard,
  retry,
}) => {
  const classes = styles();
  const renderSuccess = successMessage && (
    <SlackLandingSuccess successMessage={successMessage} onCounterFinish={onCounterFinish} />
  );
  const renderError = errorMessage && (
    <SlackLandingError
      errorMessage={errorMessage}
      goToDashboard={goToDashboard}
      retry={retry}
    />
  );
  const renderProgress = (!successMessage && !errorMessage) && (
    <SlackLandingProgress />
  );

  return (
    <Box className={classes.presenter}>
      <Box marginTop="100px">
        <img
          src={logo}
          alt="Logo"
        />
      </Box>
      <Box marginTop="150px" className={classes.alignCenter}>
        <Box marginBottom="20px">
          <SlackLogo />
        </Box>
        {renderProgress}
        {renderSuccess}
        {renderError}
      </Box>
    </Box>
  );
};

export default SlackLandingPresenter;
