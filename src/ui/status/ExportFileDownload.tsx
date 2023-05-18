import { Box, Paper, Typography } from '@material-ui/core';
import moment from 'moment';
import queryString from 'query-string';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Text from '../components/Text';
import { Translation } from '../translations/types';
import { downloadURI, logo, useDebouncedEffect } from './../../common/utils/helpers';
import apiClient from './../../state/apiClient';
import { styles } from './ExportFileDownload.styles';

enum States {
  PREPARING,
  EXPIRED,
  DOWNLOADING,
  DOWNLOAD_STARTED,
  ERROR
}

const StateMessages: {[Key in States]: Translation} = {
  [States.PREPARING]: 'exportFileDownload.preparing',
  [States.EXPIRED]: 'exportFileDownload.expired',
  [States.DOWNLOADING]: 'exportFileDownload.downloading',
  [States.DOWNLOAD_STARTED]: 'exportFileDownload.downloaded',
  [States.ERROR]: 'exportFileDownload.error',
};

const ExportFileDownload: React.FunctionComponent = () => {
  const classes = styles();
  const [status, setStatus] = useState<States>(States.PREPARING);
  const [s3Url, setS3Url] = useState<string | null>(null);
  const location = useLocation();
  const downloadUrlUUID = useMemo(() => queryString.parse(location.search).fileId as string, [location.search]);

  useEffect(() => {
    /*
      - get presigned url from server using id provided in url
    */
    apiClient
      .request({
        method: 'GET',
        url: `short_url/${downloadUrlUUID}`,
        headers: {},
      })
      .then((resp) => {
        setS3Url(resp.data.url);
      })
      .catch((exception) => {
        if (exception?.response?.status === 410) {
          setStatus(States.EXPIRED);
        } else {
          setStatus(States.ERROR);
        }
      });
  }, [downloadUrlUUID]);

  useDebouncedEffect(() => {
    /*
      - extract timestamp of creation ("X-Amz-Date") and validity duration in seconds ("X-Amz-Expires")
      - download s3 link if not expired

      https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html
    */
    if (s3Url === null) {
      return;
    }

    const urlParams = new URLSearchParams(s3Url.split('?').slice(1).join('?'));
    const date = urlParams.get('X-Amz-Date')?.replace(
      /^(.{4})(.{2})(.{2})T(.{2})(.{2})(.{2})Z$/,
      (match, year, month, day, hour, minute, second) => `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`
      );
    const duration = parseInt(urlParams.get('X-Amz-Expires') || '', 10);

    if (!date || isNaN(duration)) {
      setStatus(States.ERROR);
      return;
    }

    if (moment().isAfter(moment(date).add(duration, 'second'))) {
      setStatus(States.EXPIRED);
      return;
    }

    setStatus(States.DOWNLOADING);

    setTimeout(() => {
      downloadURI(s3Url, 'file');
      setTimeout(() => setStatus(States.DOWNLOAD_STARTED), 1 * 1000);
    }, 2 * 1000);
  }, [s3Url], 1 * 1000);

  return <div className={classes.root}>
    <Paper className={classes.paper}>
      <img
        src={logo}
        alt="Logo"
        className={classes.logo}
      />
      <Box display="flex" textAlign="center" mb={5} data-cy="ExportFileDownload-info">
        <Typography variant="h5"className={classes.info}>
          <Text translation={StateMessages[status]}/>
        </Typography>
      </Box>
    </Paper>
  </div>;
};

export default ExportFileDownload;
