import React from "react";
import { styles } from "./Loader.styles";

// TODO cleanup
const Loader: React.FunctionComponent = () => {
  const classes = styles();
  return (
    <div className={`k-loading-mask ${classes.loading}`}>
      <div className="k-loading-image"></div>
      <div className="k-loading-color"></div>
    </div>
  );
};

export default Loader;
