import { Typography } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Nullable } from '../../../../../state/ducks/common/types';
import Text from '../../../../components/Text';
import { StyleTooltip } from '../StyleTooltip';
import { styles } from './styles';

interface Props {
  url: string
  docRevVersion: Nullable<string>
  docRevName: Nullable<string>
}
const DocTitle: React.FunctionComponent<Props> = ({
  url,
  docRevVersion,
  docRevName,
}) => {
  const classes = styles();
  return (
    <StyleTooltip
      title={
        <>
          <Text translation="dashboard.revision" />
          &nbsp;{docRevVersion} {docRevName}
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
          <Text translation="dashboard.revision" />
          &nbsp;{docRevVersion} {docRevName}
        </Typography>
      </RouterLink>
    </StyleTooltip>
  );
};

export default DocTitle;
