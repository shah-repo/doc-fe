import { makeStyles } from "@material-ui/core";
import React from "react";

const Loader: React.FunctionComponent = () => {
  const styles = makeStyles(() => ({
    loading: {
      top: 0,
    },
  }));
  const classes = styles();
  return (
    <div className={`k-loading-mask ${classes.loading}`} >
      <div className="k-loading-image"></div>
      <div className="k-loading-color"></div>
    </div>
  );
};

export default Loader;
