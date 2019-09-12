import React, { Fragment } from "react";
import styles from "./BasicFields.module.css";

interface HyperLinkProps {
  title: string;
  url: string;
  closed: boolean;
}

const HyperLink: React.FunctionComponent<HyperLinkProps> = ({
  title,
  url,
  closed,
}) => {
  const hyperLinkField = (
    <div className={styles.hyperlink}>
      <h3>
        <a href={`https://${url}`} target="_blank">
          {title}
        </a>
      </h3>
    </div>
  );

  return <Fragment>{hyperLinkField}</Fragment>;
};

export default HyperLink;
