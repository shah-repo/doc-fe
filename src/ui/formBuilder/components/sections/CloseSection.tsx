import React, { Fragment, useEffect, useState } from "react";
import styles from "../basic/BasicFields.module.css";
import { formBuilderActions } from "../../../state/ducks/formBuilder";
import { connect } from "react-redux";

interface OwnProps {
  closed: boolean;
  editMode: boolean;
  diff: any;
  currentIndex: any;
}

interface DispatchProps {
  CLOSE_SECTION: typeof formBuilderActions.closeSection;
}

type CloseSectionProps = OwnProps & DispatchProps;

const CloseSection: React.FunctionComponent<CloseSectionProps> = ({
  closed,
  editMode,
  diff,
  currentIndex,
  CLOSE_SECTION,
}) => {
  const [isClosed, setClosed] = useState(closed);
  const [stateDiff, setStateDiff] = useState(diff);

  useEffect(() => {
    setStateDiff(diff);
  }, [diff]);

  useEffect(() => {
    setClosed(closed);
  }, [isClosed]);

  const closeSection = () => {
    CLOSE_SECTION(currentIndex);
  };

  const button = (
    <button
      onClick={editMode ? undefined : closeSection}
      className={styles.actionButton}>
      Close Section
    </button>
  );
  const getText = (key: string) => {
    switch (key) {
      case "title":
        return "field title";
      case "placeholder":
        return "placeholder text";
      case "options":
        return "select options";
      case "tolerance":
        return "tolerance";
      case "toleranceType":
        return "tolerance type";
      case "max":
        return "maximum tolerance value placeholder text";
      case "min":
        return "minimum tolerance value placeholder text";
      case "notes":
        return "checkbox input placeholder";
      case "url":
        return "hyperlink";
      case "text":
        return "text";
      case "textType":
        return "type of text";
      default:
        return "field";
    }
  };

  let diffList = [];
  if (stateDiff) {
    diffList = stateDiff.map((diffItem: any, i: string) => {
      const list = Object.keys(diffItem.changes[1]).map((diffItemKey, j) => {
        if (
          diffItem.changes[1][diffItemKey] !== diffItem.changes[0][diffItemKey]
        ) {
          return (
            <li key={j}>
              Changed the {getText(diffItemKey)} from{" "}
              <del>{diffItem.changes[0][diffItemKey]}</del> to{" "}
              <span className={styles.newText}>
                {diffItem.changes[1][diffItemKey]}
              </span>
            </li>
          );
        }
      });

      return (
        <div key={i} className={styles.diffContainer}>
          {diffItem.date}, {diffItem.time}, <strong>John</strong>:
          <ul>
            {list}
            <strong>Justification:</strong> {diffItem.reason}
          </ul>
        </div>
      );
    });
  }

  const diffContainer = (
    <div>
      <h4>
        <strong> Section Closed</strong>{" "}
      </h4>
      <ul> {diffList} </ul>
    </div>
  );

  return <Fragment>{closed ? diffContainer : button}</Fragment>;
};

export default connect(
  null,
  { CLOSE_SECTION: formBuilderActions.closeSection },
)(CloseSection);
