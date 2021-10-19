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

function Trainings() {
  const classes = useStyles();
  return (
    <Card className={classes.outline}>
      <CardContent>
      Training Container
        {/* <TrainingsPresenter /> */}
      </CardContent>
    </Card>);
}

export default Trainings;
