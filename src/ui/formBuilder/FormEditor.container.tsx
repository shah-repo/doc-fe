import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { formBuilderActions } from "../../state/ducks/formBuilder";
import { formReducerType } from "../../state/ducks/formBuilder/reducer";
import styles from "./FormBuilder.module.css";
import FormEditorPresenter from "./FormEditor.presenter";

interface FormBuilderState {
  formBuilderState: formReducerType;
}

interface DispatchProps {
  showModal: typeof formBuilderActions.showModal;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  formBuilderState,
});

type StateProps = FormBuilderState & DispatchProps;

const FormEditorContainer: React.FunctionComponent<StateProps> = ({
  formBuilderState,
  showModal,
}) => {
  const toggleModal = () => {
    showModal(0);
  };

  const [elements, setElements] = useState(formBuilderState.elements);

  useEffect(() => {
    setElements(formBuilderState.elements);
  }, [formBuilderState.elements]);

  const placeholder = (
    <div className={styles.formEditorContainer} onClick={toggleModal}>
      <span>ADD FIELD</span>
    </div>
  );

  const Presenter = elements.length > 0 ? <FormEditorPresenter /> : placeholder;
  return <Fragment>{Presenter}</Fragment>;
};

export default connect(
  mapStateToProps,
  {
    showModal: formBuilderActions.showModal,
  },
)(FormEditorContainer);
