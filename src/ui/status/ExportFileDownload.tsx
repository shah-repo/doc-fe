/* eslint-disable no-console */
import { Box, Paper, Typography } from "@material-ui/core";
import Base64 from "Base64";
import moment from "moment";
import queryString from "query-string";
import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { downloadURI, logo, useDebouncedEffect } from "./../../common/utils/helpers";
import { styles } from "./ExportFileDownload.styles";

enum States {
  PREPARING,
  EXPIRED,
  DOWNLOADING,
  DOWNLOAD_STARTED,
  ERROR
}

const ExportFileDownload: React.FunctionComponent = () => {
  const classes = styles();
  const [status, setStatus] = useState<States>(States.PREPARING);
  const location = useLocation();
  const urlEncoded = useMemo(() => queryString.parse(location.search).url as string, [location.search]);

  useDebouncedEffect(() => {
    if (!urlEncoded) {
      setStatus(States.ERROR);
      return;
    }

    const urlDecoded = Base64.atob(urlEncoded);
    const urlParams = new URLSearchParams(urlDecoded.split("?").slice(1).join("?"));
    const date = urlParams.get("X-Amz-Date")?.replace(
      /^(.{4})(.{2})(.{2})T(.{2})(.{2})(.{2})Z$/,
      (match, year, month, day, hour, minute, second) => `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`
      );
    const duration = parseInt(urlParams.get("X-Amz-Expires") || "", 10);

    if (!date || isNaN(duration)) {
      setStatus(States.ERROR);
      return;
    }

    if (moment().isAfter(moment(date).add(duration, "second"))) {
      setStatus(States.EXPIRED);
      return;
    }

    setStatus(States.DOWNLOADING);

    setTimeout(() => {
      downloadURI(urlDecoded, "file");
      setTimeout(() => setStatus(States.DOWNLOAD_STARTED), 1 * 1000);
    }, 2 * 1000);
  }, [urlEncoded], 2 * 1000);

  return <div className={classes.root}>
    <Paper className={classes.paper}>
      <img
        src={logo}
        alt="Logo"
        className={classes.logo}
      />
      <Box display="flex" textAlign="center" mb={5} data-cy="ExportFileDownload-info">
        <Typography variant="h5"className={classes.info}>
          <div>
            {status === States.PREPARING && "Your request is being processed ..."}
            {status === States.EXPIRED && "Link expired!"}
            {status === States.DOWNLOADING && "Your download will start in a few seconds..."}
            {status === States.DOWNLOAD_STARTED && "Your download started."}
            {status === States.ERROR && "There was an error processing your request."}
          </div>
        </Typography>
      </Box>
    </Paper>
  </div>;
};

export default ExportFileDownload;
