import React, { Fragment, useState, useEffect } from "react";
import styles from "./BasicFields.module.css";

interface MultipleHyperLinkProps {
  title: string;
  closed: boolean;
  values?: any;
  updateValue?: any;
  currentIndex?: any;
  editMode?: boolean;
}

const MultipleHyperLink: React.FunctionComponent<MultipleHyperLinkProps> = ({
  title,
  closed,
  values,
  updateValue,
  currentIndex,
  editMode,
}) => {
  const defaultHyperLinks = values ? values.hyperLinks : [];
  const [hyperLinks, addHyperLinks]: any[] = useState(defaultHyperLinks);
  const [hyperLink, setHyperLink] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (!editMode) updateValue(currentIndex, "hyperLinks", hyperLinks);
  }, [hyperLinks]);

  const hyperLinkList =
    hyperLinks &&
    hyperLinks.map((link: string, i: any) => (
      <a key={i} target="_blank" href={`http://${link}`}>
        {link}
      </a>
    ));

  const toggleShowInput = (e: any) => {
    setShowInput(!showInput);
  };

  const handleChange = (e: any) => {
    if (
      e.target.value.includes("https://") ||
      e.target.value.includes("http://")
    ) {
      const newUrl = e.target.value.replace(/(^\w+:|^)\/\//, "");
      setHyperLink(newUrl);
    } else {
      setHyperLink(e.target.value);
    }
  };

  const addLink = () => {
    addHyperLinks([...hyperLinks, hyperLink]);
    setShowInput(false);
  };

  const hyperLinkInput = (
    <Fragment>
      <input
        type="text"
        placeholder="Enter hyperlink"
        onChange={handleChange}
      />
      <button onClick={addLink}>Save</button>
      <button onClick={toggleShowInput}>Cancel</button>
    </Fragment>
  );

  const addHyperLinkSpan = (
    <span className={styles.addHyperLink} onClick={toggleShowInput}>
      + Add hyperlink
    </span>
  );

  const viewMode = (
    <Fragment>
      <div className={styles.linksContainer}>{hyperLinkList}</div>
      {showInput ? hyperLinkInput : null}
      {!showInput ? addHyperLinkSpan : null}
    </Fragment>
  );

  const editModeDiv = <span>This will display the ability to add lists</span>;

  const currentDiv = editMode ? editModeDiv : viewMode;

  return (
    <div className={styles.MultipleHyperLinkContainer}>
      <h3>{title}</h3>
      {currentDiv}
    </div>
  );
};

export default MultipleHyperLink;
