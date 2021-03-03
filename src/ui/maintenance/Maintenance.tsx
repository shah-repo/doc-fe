import React from "react";
import Text from "../components/Text";
import { styles } from "./Maintenance.styles";

const Maintenance: React.FunctionComponent = () => {
  const classes = styles();
  return (
    <div className={classes.container}>
      <div className={classes.base}>
        <img
          src="/logo_enlil_dark.svg"
          alt="Enlil logo"
        />
      </div>
      <div className={classes.base}>
        <img src="/maintenance.svg" alt="Maintenance" className={classes.image} />
      </div>
      <div className={classes.base} style={{ textAlign: "center", whiteSpace: "pre-line" }}>
        <h1 className={classes.title}>
          <Text translation="maintenance.title" />
        </h1>
        <p className={classes.body}>
          <Text translation="maintenance.body" />
        </p>
      </div>
      <div className={classes.linkContainer}>
        <a href="/" className={classes.link}>
          <Text translation="return.home" />
        </a>
      </div>
    </div>
  );
};

export default Maintenance;
