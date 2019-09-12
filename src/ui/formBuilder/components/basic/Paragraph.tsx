import React, { Fragment } from "react";
import styles from "./BasicFields.module.css";

interface ParagraphProps {
  text: any;
  textType: string;
  closed: boolean;
}

const Paragraph: React.FunctionComponent<ParagraphProps> = ({
  text,
  closed,
  textType,
}) => {
  let textContainer;

  if (textType === "heading") {
    textContainer = <h2 dangerouslySetInnerHTML={{ __html: text }} />;
  } else {
    textContainer = <p dangerouslySetInnerHTML={{ __html: text }} />;
  }

  const ParagraphField = (
    <div className={styles.paragraph}>{textContainer}</div>
  );

  return <Fragment>{ParagraphField}</Fragment>;
};

export default Paragraph;
