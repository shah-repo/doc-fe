import React, { useEffect, useState } from "react";
import Text from "../../components/Text";
import useInterval from "../../hooks/useInterval";

interface Props {
  onCounterFinish: () => void;
}

export const SlackLandingCounter: React.FunctionComponent<Props> = ({
  onCounterFinish,
}) => {
  const [timerValue, updateTimerValue] = useState(5);
  useEffect(() => {
    if (timerValue === 0) {
      onCounterFinish();
    }
  }, [timerValue]);
  useInterval(() => {
    if (timerValue > 0) {
      updateTimerValue(timerValue - 1);
    }
  }, 1000);

  return (
    <div>
      <Text translation="common.redirected.in" values={{ time: timerValue }} />
    </div>
  );
};

export default SlackLandingCounter;
