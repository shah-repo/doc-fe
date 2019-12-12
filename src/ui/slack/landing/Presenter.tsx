import { Typography } from "@material-ui/core";
import React from "react";
import { logo } from "../../../common/utils/helpers";
import { AsyncState } from "../../../state/types";
import FormProgress from "../../components/forms/FormProgress";
import Text from "../../components/Text";
import SlackLandingCounter from "./Counter";
import { styles } from "./styles";

interface Props {
  asyncState: AsyncState;
  successMessage: string;
  errorMessage: string;
  onCounterFinish: () => void;
}

export const SlackLandingPresenter: React.FunctionComponent<Props> = ({
  asyncState,
  successMessage,
  errorMessage,
  onCounterFinish,
}) => {
  const classes = styles();
  const renderSuccess = successMessage && (
    <Typography variant="h4">
      <Text message={successMessage} />
    </Typography>
  );
  const renderError = errorMessage && (
    <Typography variant="h4" color="error">
      <Text message={errorMessage} />
    </Typography>
  );
  const startCounter = (successMessage || errorMessage) && (
    <SlackLandingCounter onCounterFinish={onCounterFinish} />
  );

  return (
    <div className={classes.presenter}>
      <img
        src={logo}
        alt="Logo"
      />
      <Typography variant="h4">
        <Text translation="slack.finishing.registration" />
      </Typography>
      <FormProgress asyncState={asyncState} />
      {renderSuccess}
      {renderError}
      {startCounter}
    </div>
  );
};

export default SlackLandingPresenter;
