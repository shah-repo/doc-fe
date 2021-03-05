import { Box, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as SuccessIcon } from "../../../assets/images/success_icon.svg";
import Text from "../../components/Text";
import SlackLandingCounter from "./Counter";
import { styles } from "./styles";

interface Props {
  successMessage: string;
  onCounterFinish: () => void;
}

const SlackLandingSuccess: React.FunctionComponent<Props> = ({
  successMessage,
  onCounterFinish,
}) => {
  const classes = styles();
  return (
    <Box className={classes.alignCenter}>
      <Typography variant="h6">
        <Text message={successMessage} />
      </Typography>
      <Box margin="30px 0">
        <SuccessIcon />
      </Box>
      <SlackLandingCounter onCounterFinish={onCounterFinish} />
    </Box>
  );
};

export default SlackLandingSuccess;
