import React, { Fragment, useCallback, useState } from "react";
import { connect } from "react-redux";
import { formBuilderActions } from "../../../../state/ducks/formBuilder";
import { FieldConstants } from "./FieldConstants";
import FieldPresenter from "./helper/ModalFieldPresenter";
import styles from "./Modal.module.css";

interface BigObject<T> {
  [index: string]: T;
}

interface DispatchProps {
  addField: typeof formBuilderActions.addField;
}

const NewFieldModal: React.FunctionComponent<DispatchProps> = ({
  addField,
}) => {
  const [chosenField, setChosenField] = useState("");

  const addFieldHandler = useCallback(
    (e: any, config: any) => {
      const field = {
        type: chosenField,
        config,
      };
      e.preventDefault();
      if (!config.colWidth) {
        config.colWidth = "col-12";
      }
      addField(field);
    },
    [chosenField],
  );

  const handleClick = (field: string) => {
    setChosenField(field);
  };

  const sections: BigObject<string> = FieldConstants.sections;
  const sectionButtons = Object.keys(sections).map((value) => (
    <button
      className={styles[value]}
      onClick={() => handleClick(value)}
      key={value}
    >
      {sections[value]}
    </button>
  ));

  const basicFields: BigObject<string> = FieldConstants.basicFields;
  const basicFieldButtons = Object.keys(basicFields).map((value) => (
    <button
      className={styles[value]}
      onClick={() => handleClick(value)}
      key={value}
    >
      {basicFields[value]}
    </button>
  ));

  const approvals: BigObject<string> = FieldConstants.approvals;
  const approvalButtons = Object.keys(approvals).map((value) => (
    <button
      className={styles[value]}
      onClick={() => handleClick(value)}
      key={value}
    >
      {approvals[value]}
    </button>
  ));

  const lists: BigObject<string> = FieldConstants.lists;
  const listButtons = Object.keys(lists).map((value) => (
    <button
      className={styles[value]}
      onClick={() => handleClick(value)}
      key={value}
    >
      {lists[value]}
    </button>
  ));

  const buttonGroup = (title: string, buttons: JSX.Element[]) => (
    <div className={styles.buttonGroup}>
      <h2>{title}</h2>
      {buttons}
    </div>
  );

  const modalContent = (
    <div>
      {buttonGroup("Section", sectionButtons)}
      {buttonGroup("Basic Fields", basicFieldButtons)}
      {buttonGroup("Approvals", approvalButtons)}
      {buttonGroup("Lists", listButtons)}
    </div>
  );

  return (
    <Fragment>
      {chosenField && (
        <FieldPresenter
          chosenField={chosenField}
          clickHandler={addFieldHandler}
        />
      )}
      {!chosenField && modalContent}
    </Fragment>
  );
};

export default connect(
  null,
  { addField: formBuilderActions.addField },
)(NewFieldModal);
