/* eslint-disable react/react-in-jsx-scope */
// import React from 'react'
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import Text from "../../components/Text";

const useStyles = makeStyles((theme: Theme) => ({
  outline: {
    // border: "1px solid grey",
    overflow: "auto",
    minHeight: "calc(100vh - 145px)",
    maxHeight: "calc(100vh - 145px)",
  },
}));

function DashboardChart() {
  const classes = useStyles();
  return (
    <Card className={classes.outline}>
      <CardContent>
        <Text translation={"training.stats.container.title"} />
        {/* <TrainingChart /> */}
        {/* <TrainingLineItems /> */}
      </CardContent>
    </Card>);
}

export default DashboardChart;
