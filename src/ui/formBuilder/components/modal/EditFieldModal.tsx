import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { formBuilderActions } from "../../../state/ducks/formBuilder";
import { formReducerType } from "../../../state/ducks/formBuilder/reducer";
import ModalFieldPresenter from "./helper/ModalFieldPresenter";
import styles from "./Modal.module.css";

interface DispatchProps {
  HIDE_MODAL: typeof formBuilderActions.hideModal;
  UPDATE_FIELD: typeof formBuilderActions.updateField;
  RECORD_UPDATES: typeof formBuilderActions.recordUpdates;
}

interface StateProps {
  formBuilderState: formReducerType;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  formBuilderState,
});

type EditFieldModalProps = StateProps & DispatchProps;

const EditFieldModal: React.FunctionComponent<EditFieldModalProps> = ({
  formBuilderState,
  HIDE_MODAL,
  UPDATE_FIELD,
  RECORD_UPDATES,
}) => {
  // eslint-disable-next-line
  const { currentField } = formBuilderState;
  const [reason, setReason] = useState();
  const [withReason, setWithReason] = useState(false);

  const updateField = (e: any, config: any) => {
    e.preventDefault();
    if (!config.colWidth) {
      config.colWidth = "col-12";
    }
    if (currentField.closed) {
      RECORD_UPDATES(
        currentField.config,
        config,
        currentField.currentIndex,
        reason,
      );
    }
    UPDATE_FIELD(
      currentField.type,
      config,
      currentField.currentIndex,
      currentField.closed,
    );
  };

  const hideModal = (e: any) => {
    e.stopPropagation();
    HIDE_MODAL();
  };

  const submitReason = () => {
    setWithReason(true);
  };

  const handleReasonChange = (e: any) => {
    setReason(e.target.value);
  };

  const reasonModal = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBody}>
        <div className={styles.close} onClick={hideModal}>
          X
        </div>
        <form onSubmit={submitReason}>
          <h3 style={{ marginBottom: "10px" }}>
            This section is closed, please provide a reason for editing this
            field.
          </h3>
          <textarea
            value={reason}
            onChange={handleReasonChange}
            placeholder="Please include a reason"
            required={true}
          />
          <button> Save Reason </button>
        </form>
      </div>
    </div>
  );

  const modalStateContent = (
    <ModalFieldPresenter
      chosenField={currentField.type}
      currentConfig={currentField.config}
      clickHandler={updateField}
    />
  );

  const showReasonModal = currentField.closed && !withReason;

  return (
    <Fragment>{showReasonModal ? reasonModal : modalStateContent}</Fragment>
  );
};

export default connect(
  mapStateToProps,
  {
    HIDE_MODAL: formBuilderActions.hideModal,
    RECORD_UPDATES: formBuilderActions.recordUpdates,
    UPDATE_FIELD: formBuilderActions.updateField,
  },
)(EditFieldModal);
