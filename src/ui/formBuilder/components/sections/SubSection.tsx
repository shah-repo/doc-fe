import React from "react";
import styles from "./Section.module.css";

interface SubSectionProps {
  title: string;
  closed: boolean;
}

const SubSection: React.FunctionComponent<SubSectionProps> = ({
  title,
  closed,
}) => {
  return (
    <div className={styles.subSection}>
      {" "}
      <h3>{title}</h3>{" "}
    </div>
  );
};

export default SubSection;
