/* eslint-disable react/react-in-jsx-scope */
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  outline: {
    // border: "1px solid grey",
    overflow: "auto",
    minHeight: "calc(100vh - 145px)",
    maxHeight: "calc(100vh - 145px)",
  },
}));

function Recents() {
  const classes = useStyles();
  return (
    <Card className={classes.outline}>
      <CardContent>
      Recent Container
        {/* <RecentsPresenter /> */}
      </CardContent>
    </Card>);
}

export default Recents;
