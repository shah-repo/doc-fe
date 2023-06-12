import {
  Avatar,
  Grid,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import {
  getFormattedDateString,
  MomentFormats,
} from '../../../../common/utils/date';
import { Nullable } from '../../../../state/ducks/common/types';
import { TrainingStatusTypes } from '../../../../state/ducks/dashboard.new/training.stats/types';
import { getInitalsFromName } from '../../../components/icons/avatar/helpers';
import Text from '../../../components/Text';
import { styles } from './TrainingItem.styles';

interface TrainingItemProps {
  id: string;
  avatar: Nullable<string>;
  name: string;
  initialColor: string;
  documentId: string;
  title: string;
  status: string;
  date: string;
}

const TrainingItem: React.FunctionComponent<TrainingItemProps> = ({
  id,
  name,
  avatar,
  initialColor,
  status,
  date,
  documentId,
  title,
}) => {
  const classes = styles();
  const isOverdue = status === TrainingStatusTypes.OVERDUE;

  const titleRender = (
    avatar,
    name,
    initialColor,
    status,
    documentId,
    title,
    date
  ) => (
    <>
      <Grid container className={classes.header}>
        <Grid item className={classes.headerLeft}>
          {avatar ? (
            <Avatar
              style={{ backgroundColor: `${initialColor}` }}
              className={classes.avatar}
              alt={name}
              src={avatar}
            />
          ) : (
            <Avatar
              style={{ backgroundColor: `${initialColor}` }}
              className={classes.avatar}
            >
              {getInitalsFromName(name)}
            </Avatar>
          )}
          <Typography
            component="span"
            variant="body2"
            className={classes.name}
            color="textPrimary"
          >
            {name}
          </Typography>
        </Grid>
        <Grid item className={classes.headerRight}>
          <Typography
            className={cx(classes.status, isOverdue ? classes.statusOverdue : classes.statusDueInfewDays)}
            component="span"
            variant="body2"
            color="textPrimary"
          >
            <Text translation={isOverdue ? 'common.overdue' : 'common.duein7days'} />
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container={true}
        wrap="nowrap"
        justify="flex-start"
        alignItems="center"
        className={classes.contentSection}
      >
        <Grid item={true}>
          <Typography
            component="span"
            variant="body2"
            className={`${classes.docIdAndTitle} ${classes.margin5}`}
            color="textPrimary"
          >
            {documentId}
          </Typography>
          <Typography
            component="span"
            variant="body2"
            className={classes.docIdAndTitle}
            color="textPrimary"
            dangerouslySetInnerHTML={{ __html: title }}
          ></Typography>
        </Grid>
      </Grid>
      <Grid
        container={true}
        wrap="nowrap"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item={true}>
          <Typography
            component="span"
            variant="body2"
            className={classes.date}
            color="textPrimary"
          >
            <Text translation="common.due.date" />:{' '}
            {getFormattedDateString(date, MomentFormats.BriefDateTime)}
          </Typography>
        </Grid>
      </Grid>
    </>
  );

  return (
    <ListItem divider>
      <ListItemText
        id={documentId}
        primary={titleRender(
          avatar,
          name,
          initialColor,
          status,
          documentId,
          title,
          date
        )}
      />
    </ListItem>
  );
};

export default React.memo(TrainingItem);
