import { Box, Button, Link, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as WarningIcon } from "../../../assets/images/warning_icon.svg";
import Text from "../../components/Text";
import { styles } from "./styles";

interface Props {
  errorMessage: string;
  goToDashboard: () => void;
  retry: () => void;
}

const SlackLandingError: React.FunctionComponent<Props> = ({
  errorMessage,
  goToDashboard,
  retry,
}) => {
  const classes = styles();

  return (
    <Box className={classes.alignCenter}>
      <Typography variant="h6">
        <Text message={errorMessage} />
      </Typography>
      <Box margin="30px 0">
        <WarningIcon />
      </Box>
      <Box display="flex" marginBottom="20px">
        <Typography variant="h6">
          <Text translation="common.error.occured" />
        </Typography>
        &nbsp;
        <Link
          component="button"
          underline="none"
          onClick={retry}
        >
          <Typography variant="h6">
            <Text translation="common.click.to.try.again" />
          </Typography>
        </Link>
      </Box>
      <Button
        variant="text"
        color="primary"
        onClick={goToDashboard}
      >
        <Text translation="common.go.to.enlil" />
      </Button>
    </Box>
  );
};

export default SlackLandingError;
