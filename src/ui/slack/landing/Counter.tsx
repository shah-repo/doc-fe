import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Text from "../../components/Text";
import useInterval from "../../hooks/useInterval";

interface Props {
  onCounterFinish: () => void;
}

const SlackLandingCounter: React.FunctionComponent<Props> = ({
  onCounterFinish,
}) => {
  const [timerValue, updateTimerValue] = useState(3);
  useEffect(() => {
    if (timerValue === 0) {
      onCounterFinish();
    }
  }, [timerValue, onCounterFinish]);
  useInterval(() => {
    if (timerValue > 0) {
      updateTimerValue(timerValue - 1);
    }
  }, 1000);

  return (
    <Typography variant="h6">
      <Text
        translation="common.redirecting.to.enlil"
        values={{ time: timerValue, name: <b>Enlil</b> }}
      />
    </Typography>
  );
};

export default SlackLandingCounter;
