import { Typography } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styles } from './styles';

interface Props {
  url: string;
  docId: string;
}
const DocId: React.FunctionComponent<Props> = ({ url, docId }) => {
  const classes = styles();
  return (
    <RouterLink
      to={url}
      color="inherit"
      className={classes.link}
    >
      <Typography
        component="span"
        variant="body2"
        className={`${classes.typography} ${classes.margin5}`}
        color="textPrimary"
        noWrap
      >
        {docId}
      </Typography>
    </RouterLink>
  );
};

export default DocId;
