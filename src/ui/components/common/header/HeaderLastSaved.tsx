import { Box, CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ReactComponent as CloudIcon } from "../../../../assets/images/cloud.svg";
import { getHumanizedFormat } from "../../../../common/utils/date";
import Text from "../../Text";
import useStyles from "./HeaderLastSaved.styles";

interface Props {
  timestamp: string;
  loading?: boolean;
  updateInterval?: number;
}

const HeaderLastSaved: React.FC<Props> = ({
  loading,
  timestamp,
  updateInterval = 60,
}) => {
  const classes = useStyles();
  const [, setTime] = useState(Date.now());
  const lastSavedTimestamp = getHumanizedFormat(timestamp);
  const updateIntervalMs = updateInterval * 1000;

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), updateIntervalMs);
    return () => {
      clearInterval(interval);
    };
  }, [updateIntervalMs]);

  return (
    <Box className={classes.root}>
      {loading ? (
        <>
          <CircularProgress color="inherit" size={12} className={classes.icon} />
          <Text dataCy="header.autoSaving" translation="form.builder.header.autoSaving" />
        </>
      ) : (
        <>
          <CloudIcon className={classes.icon} />
          <Text dataCy="header.lastSaved" translation="form.builder.header.lastSaved" values={{ lastSavedTimestamp }} />
        </>
      )}
    </Box>
  );
};

export default HeaderLastSaved;
