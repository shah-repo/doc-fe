import React from "react";
import { connect } from "react-redux";
import { formBuilderActions } from "../../../state/ducks/formBuilder";
import EditFieldModal from "./EditFieldModal";
import styles from "./Modal.module.css";
import NewFieldModal from "./NewFieldModal";
import { formReducerType } from "../../../state/ducks/formBuilder/reducer";

interface DispatchProps {
  hideModal: typeof formBuilderActions.hideModal;
}
interface StateProps {
  formBuilderState: formReducerType;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  formBuilderState,
});

type ModalProps = StateProps & DispatchProps;

const Modal: React.FunctionComponent<ModalProps> = ({
  hideModal,
  formBuilderState,
}) => {
  // eslint-disable-next-line

  let modalContent;

  if (!formBuilderState.currentField) {
    modalContent = <NewFieldModal />;
  } else {
    modalContent = <EditFieldModal />;
  }

  const hideStateModal = (e: any) => {
    e.stopPropagation();
    hideModal();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBody}>
        <div className={styles.close} onClick={hideStateModal}>
          X
        </div>
        {modalContent ? modalContent : null}
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  { hideModal: formBuilderActions.hideModal },
)(Modal);
