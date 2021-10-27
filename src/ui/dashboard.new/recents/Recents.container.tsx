/* eslint-disable react/react-in-jsx-scope */
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import Text from "../../components/Text";

const useStyles = makeStyles((theme: Theme) => ({
  outline: {
    overflow: "auto",
    minHeight: "calc(100vh - 145px)",
    maxHeight: "calc(100vh - 145px)",
  },
}));

const RecentsLineItemsContainer: React.FunctionComponent = () => {
  const classes = useStyles();
  return (
    <Card className={classes.outline}>
      <CardContent>
        <Text translation={"dashboard.recent.container"} />
        {/* <RecentsPresenter /> */}
      </CardContent>
    </Card>);
};

export default RecentsLineItemsContainer;
