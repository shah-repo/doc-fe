import { Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FlagIcon from "@material-ui/icons/Flag";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  crTitle: string;
  url: string;
  crId: string;
  crIdName: string;
  owner: string;
  avatar: string | null;
  createdAt: string;
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // maxWidth: 345,
    },
    avatar: {
      // backgroundColor: red[500],
    },
  }));

const DashboardCRBaseContent: React.FunctionComponent<Props> = ({
  title,
  crTitle,
  url,
  crId,
  crIdName,
  owner,
  avatar,
  createdAt,
}) => {
  const classes = styles();
  const titleRender = () => (
    <Link to={url} style={{ textDecoration: "none", color: "inherit" }}>
      <div> <b> {owner} </b> needs your approval for <b> {crIdName} {title} </b>
        <Typography variant="subtitle2"> {createdAt} </Typography>
      </div>
    </Link>
  );
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {avatar}
          </Avatar>
        }
        action={
          <div>
            <IconButton aria-label="flag">
              <FlagIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="settings">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </div>
        }
        subheader={ titleRender() }
      />
    </Card>
  ); };

export default DashboardCRBaseContent;
