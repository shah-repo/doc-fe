import { Grid, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { StyledListItem } from '../common/StyledListItem';
import useStyles from './defaultLineItem.styles';

interface Props {
  type: string;
  status?: string;
  onMouseHoverItem: (id: string) => void;
}

const ApprovalChangePresenter: React.FC<Props> = ({
  type,
  status,
  onMouseHoverItem,
}) => {
  const classes = useStyles();

  const onMouseHoverListItem = () => {
    onMouseHoverItem('');
  };

  return (
    <StyledListItem
      button
      divider
      disableRipple
      className={classes.buttoncursor}
      onMouseEnter={onMouseHoverListItem}
    >
      <ListItemText
        primary={
          <Grid container={true}>
            <Grid item={true} md={12} sm={12}>
              <Typography
                component="span"
                variant="body2"
                className={`${classes.typography} ${classes.margin5}`}
                color="textPrimary"
              >
                {type}
              </Typography>
              <Typography
                component="span"
                variant="caption"
                className={`${classes.typographyBold} ${classes.margin5}`}
                color="textSecondary"
              >
                {status}
              </Typography>
            </Grid>
          </Grid>
        }
      />
    </StyledListItem>
  );
};

export default ApprovalChangePresenter;
