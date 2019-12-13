import { Typography } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import SlackLandingCounter from "./Counter";

interface Props {
  successMessage: string;
  onCounterFinish: () => void;
}

export const SlackLandingSuccess: React.FunctionComponent<Props> = ({
  successMessage,
  onCounterFinish,
}) => {
  return (
    <>
      <Typography variant="h4">
        <Text message={successMessage} />
      </Typography>
      <SlackLandingCounter onCounterFinish={onCounterFinish} />
    </>
  );
};

export default SlackLandingSuccess;
