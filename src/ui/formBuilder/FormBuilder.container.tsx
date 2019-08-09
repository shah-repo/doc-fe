import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { formReducerType } from "../../state/ducks/formBuilder/reducer";
import styles from "../components/modal/Modal.module.css";
import FormBuilderPresenter from "./FormBuilder.presenter";
import { formBuilderActions } from "../../state/ducks/formBuilder";

interface FormBuilderStateType {
  formBuilderState: formReducerType;
}

interface DispatchProps {
  setFormInfo: typeof formBuilderActions.setFormInfo;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  formBuilderState,
});

type StateProps = FormBuilderStateType & DispatchProps;

const FormBuilderContainer: React.FunctionComponent<StateProps> = ({
  formBuilderState,
  setFormInfo,
}) => {
  const [formState] = useState(formBuilderState);
  const [headerState, setHeaderState] = useState();
  const [withHeader, setwithHeader] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setHeaderState({ ...headerState, [name]: value });
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    setFormInfo(headerState.title, headerState.formNumber, "Draft");
    setwithHeader(true);
  };

  const createForm = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBody}>
        <form onSubmit={submitForm}>
          <div className={styles.modalFormContainer}>
            <h2> Create a form</h2>
            <label>Form Title</label>
            <input
              type="text"
              onChange={handleInputChange}
              name="title"
              placeholder="Enter here"
              required={true}
            />
            <label>Form Number</label>
            <input
              type="text"
              onChange={handleInputChange}
              name="formNumber"
              placeholder="Enter here"
              required={true}
            />
            <button>CREATE</button>
          </div>
        </form>
      </div>
    </div>
  );

  const formBuilderPresenter = <FormBuilderPresenter {...formState} />;

  return <Fragment>{withHeader ? formBuilderPresenter : createForm}</Fragment>;
};

export default connect(
  mapStateToProps,
  { setFormInfo: formBuilderActions.setFormInfo },
)(FormBuilderContainer);
