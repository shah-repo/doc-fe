import { Typography } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Nullable } from '../../../../../state/ducks/common/types';
import { StyleTooltip } from '../StyleTooltip';
import { styles } from './styles';

interface Props {
  url: string;
  title: Nullable<string>;
}
const ApprovalTitle: React.FunctionComponent<Props> = ({
  url,
  title,
}) => {
  const classes = styles();
  return (
    <StyleTooltip
      title={
        <>
          {title}
        </>
      }
      placement="top-start"
      arrow
      PopperProps={{ popperOptions: {} }}
    >
      <RouterLink to={url} color="inherit" className={classes.link}>
        <Typography
          component="span"
          variant="caption"
          className={`${classes.typographyBold} ${classes.margin5}`}
          color="textSecondary"
          noWrap
        >
          {title}
        </Typography>
      </RouterLink>
    </StyleTooltip>

  );
};

export default ApprovalTitle;
