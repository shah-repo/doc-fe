import { Chip, Grid, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import Text from "../../Text";
import { styles } from "./HeaderInfo.styles";

export interface Props {
  status: string;
  id: string;
  name: string;
}

export const HeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
}) => {
  const classes = styles();
  const isStatusReleased = status === DocumentRevisionStatus.Released;
  const statusIcon = () =>
    <div className={classNames(classes.statusIconDefault, {
      [classes.statusIconReleased]: isStatusReleased,
    })}/>;

  return (
    <Grid container={true} xs={6} alignItems="center">
      <Chip
        label={<Text message={status} />}
        id="HeaderInfo-status"
        className={classNames(classes.statusDefault, {
          [classes.statusReleased]: isStatusReleased,
        })}
        icon={statusIcon()}
      />
      <Typography variant="h6" id="HeaderInfo-docId" className={classes.id} >
        {id}
      </Typography>
      <Typography variant="h6" id="HeaderInfo-name">
        {name}
      </Typography>
    </Grid>
  ); };

export default HeaderInfo;
