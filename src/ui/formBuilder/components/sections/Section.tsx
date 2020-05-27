import React from "react";
import styles from "./Section.module.css";

interface SecTionProps {
  title: string;
  closed: boolean;
}

const Section: React.FunctionComponent<SecTionProps> = ({ title, closed }) => (
  <div className={styles.section}>
    {" "}
    <h2>{title}</h2>{" "}
  </div>
);

export default Section;
