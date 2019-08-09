import React, { Fragment, useCallback, useEffect, useState } from "react";
import { FieldConstants } from "./FieldConstants";
import FieldPresenter from "./helper/ModalFieldPresenter";
import styles from "./Modal.module.css";
import { formBuilderActions } from "../../../state/ducks/formBuilder";
import { connect } from "react-redux";

interface BigObject<T> {
  [index: string]: T;
}

interface DispatchProps {
  ADD_FIELD: typeof formBuilderActions.addField;
}

const NewFieldModal: React.FunctionComponent<DispatchProps> = ({
  ADD_FIELD,
}) => {
  const [chosenField, setChosenField] = useState();
  const [modalStateContent, setModalContent] = useState();

  const addField = useCallback(
    (e: any, config: any) => {
      const field = {
        type: chosenField,
        config,
      };
      e.preventDefault();
      if (!config.colWidth) {
        config.colWidth = "col-12";
      }
      ADD_FIELD(field);
    },
    [chosenField],
  );

  const handleClick = (field: string) => {
    setChosenField(field);
  };

  const sections: BigObject<string> = FieldConstants.sections;
  const sectionButtons = Object.keys(sections).map(value => {
    return (
      <button
        className={styles[value]}
        onClick={() => handleClick(value)}
        key={value}>
        {sections[value]}
      </button>
    );
  });

  const basicFields: BigObject<string> = FieldConstants.basicFields;
  const basicFieldButtons = Object.keys(basicFields).map(value => {
    return (
      <button
        className={styles[value]}
        onClick={() => handleClick(value)}
        key={value}>
        {basicFields[value]}
      </button>
    );
  });

  const approvals: BigObject<string> = FieldConstants.approvals;
  const approvalButtons = Object.keys(approvals).map(value => {
    return (
      <button
        className={styles[value]}
        onClick={() => handleClick(value)}
        key={value}>
        {approvals[value]}
      </button>
    );
  });

  const lists: BigObject<string> = FieldConstants.lists;
  const listButtons = Object.keys(lists).map(value => {
    return (
      <button
        className={styles[value]}
        onClick={() => handleClick(value)}
        key={value}>
        {lists[value]}
      </button>
    );
  });

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

  useEffect(() => {
    if (chosenField) {
      setModalContent(
        <FieldPresenter chosenField={chosenField} clickHandler={addField} />,
      );
    } else {
      setModalContent(modalContent);
    }
  }, [chosenField]);
  return <Fragment>{modalStateContent}</Fragment>;
};

export default connect(
  null,
  { ADD_FIELD: formBuilderActions.addField },
)(NewFieldModal);
