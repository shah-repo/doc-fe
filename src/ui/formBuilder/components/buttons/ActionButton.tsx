import React, { Fragment } from "react";
import styles from "../basic/BasicFields.module.css";

interface ActionButtonProps {
  title: string;
  closed: boolean;
}

const ActionButton: React.FunctionComponent<ActionButtonProps> = ({
  title,
  closed,
}) => {
  const Button = <button className={styles.actionButton}>{title}</button>;

  return <Fragment>{Button}</Fragment>;
};

export default ActionButton;
