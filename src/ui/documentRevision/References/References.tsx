import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { getFormattedDateString } from "../../../common/utils/date";
import Text from "../../components/Text";
import ReferencedByContainer from "../../document.revision/summary/referencedBy.container";
import ReferenceToContainer from "../../document.revision/summary/referenceTo.container";
import { styles } from "./References.styles";

const References = ({
  owner,
  status,
  referencedBy,
  deprecatedAt,
  referenceTo,
  released,
}) => {
  const classes = styles();
  return (
    <Box margin={2}>
      <Typography className={classes.generalInfo}>
        <Text translation="common.general.info" />
      </Typography>
      <ListItem alignItems="flex-start" disableGutters className={classes.listItem}>
        <ListItemAvatar>
          <Avatar
            className={classes.avatar}
            alt={owner.user.name}
            src={owner.user.avatar}
          />
        </ListItemAvatar>
        <ListItemText
          primary={(
            <Typography className={classes.generalInfo}>
              {owner.user.name}
            </Typography>)}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
                className={classes.secondaryText}
              >
                Owner
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      <ReferenceToContainer
        dataProp={referenceTo}
        status={status}
        deprecatedAt={deprecatedAt}
      />
      <ReferencedByContainer dataProp={referencedBy} />
      <Box>
        <Typography component="span" className={classes.releaseDate}>
          Release Date
        </Typography>
        <Typography className={classes.released}>
          {getFormattedDateString(released as string, "YYYY-MM-DD")}
        </Typography>
      </Box>
    </Box>
  );
};

export default References;
