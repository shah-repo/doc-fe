import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";

const NoDataFound: React.FunctionComponent = () => {
  const styles = makeStyles(() => ({
    font: {
      fontFamily: "Sora",
      fontSize: 12,
      fontWeight: 600,
    },
  }));
  const classes = styles();
  return (
    <Typography className={classes.font}>
      <Text translation="table.no.results.found"></Text>
    </Typography>
  );
};

export default NoDataFound;
