import { Collapse, createStyles, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, Theme, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ExpandMore from "@material-ui/icons/ExpandMore";
import FlagIcon from "@material-ui/icons/Flag";
import ListIcon from "@material-ui/icons/List";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import React from "react";
import { Link } from "react-router-dom";
import Colors from "../../layout/theme/utils/colors";

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
    containerWrap: {
      paddingLeft: "42px",
      marginTop: "15px",
      marginBottom: "15px",
    },
    itemWrap: {
      display: "flex",
      justifyContent: "flex-end",
    },
    // root: {
    //   // maxWidth: 345,
    // },
    avatar: {
      // backgroundColor: red[500],
    },
    root: {
      width: "100%",
      // maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));

const DashboardCRBase: React.FunctionComponent<Props> = ({
  title,
  crTitle,
  url,
  crId,
  crIdName,
  owner,
  avatar,
  createdAt,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const classes = styles();
  const titleRender = () => (
    <Link to={url} style={{ textDecoration: "none", color: "inherit" }}>
      <div> <b> {owner} </b> needs your approval for <b> {crIdName} {title} </b>
        <Typography variant="subtitle2" style={{ color: Colors.gray }}> {createdAt} </Typography>
      </div>
    </Link>
  );
  const childTitleRender = () => (
    <Link to={url} style={{ textDecoration: "none", color: "inherit" }}>
      <div> <b> {owner} </b> needs your approval for <b> {crIdName} {title} </b>
      </div>
    </Link>
  );
  return (
    <Grid
      container={true}
      className={classes.containerWrap}
    >
      { <Grid
        item={true}
        xs={12}
      >
        {/* <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="owner" className={classes.avatar}>
                {avatar}
              </Avatar>
            }
            action={
              <div>
                <IconButton aria-label="flag">
                  <FlagIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="settings">
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </div>
            }
            subheader={ titleRender() }
          />
        </Card> */}
        <ListItem button onClick={handleClick}>
          {open ? <ChevronRight /> : <ExpandMore />}
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              {avatar || owner[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText id={crId} primary={ titleRender() } />
          <ListItemSecondaryAction>
            <div>
              <IconButton aria-label="flag">
                <FlagIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="settings">
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </div>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItem button className={classes.nested}>
              <IconButton aria-label="listIcon">
                <ListIcon fontSize="small" />
              </IconButton>
              <ListItemText id={crId} primary={ childTitleRender() } />
            </ListItem>
          </List>
        </Collapse>
      </Grid>
      }
    </Grid>
  ); };

export default DashboardCRBase;
