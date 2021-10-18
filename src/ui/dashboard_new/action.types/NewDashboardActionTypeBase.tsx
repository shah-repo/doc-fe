import { Avatar, createStyles, Grid, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, Theme } from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  index: number;
  title: string;
  description: string;
  url: string;
  alert?: boolean;
  alertMessage?: string;
  dataCy?: string;
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
    root: {
      // maxWidth: 345,
    },
    avatar: {
      // backgroundColor: red[500],
    },
  }));

const DashboardActionTypeBase: React.FunctionComponent<Props> = ({
  index,
  title,
  description,
  url,
  alert,
  alertMessage,
  children,
  dataCy,
}) => {
  // const [isHover, setIsHover] = useState(false);
  const classes = styles();
  const titleRender = () => (
    <Link to={url} style={{ textDecoration: "none", color: "inherit" }}>
      {/* <div> <b> {owner} </b> needs your approval for <b> {crIdName} {title} </b>
        <Typography variant="subtitle2" style={{ color: Colors.gray }}> {createdAt} </Typography>
      </div> */}
      {title} {alertMessage}
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
        <ListItem button>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              T
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={ titleRender() } />
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
      </Grid>
      }
    </Grid>
  );
};

export default DashboardActionTypeBase;
