import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { formBuilderActions } from "../../state/ducks/formBuilder";
import { formReducerType } from "../../state/ducks/formBuilder/reducer";
import styles from "./components/modal/Modal.module.css";
import FormBuilderPresenter from "./FormBuilder.presenter";

interface FormBuilderStateType {
  formBuilderState: formReducerType;
  handleChange: (title: string, formNumber: number) => void;
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
  handleChange,
}) => {
  const [formState] = useState(formBuilderState);
  const [headerState, setHeaderState] = useState({ title: "", formNumber: 0 });
  const [withHeader, setwithHeader] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setHeaderState({ ...headerState, [name]: value });
    handleChange(headerState.title, headerState.formNumber);
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    setFormInfo(headerState.title, headerState.formNumber, "Draft");
    setwithHeader(true);
  };

  const createForm = (
    <div className="formBuilder">
      <form onSubmit={submitForm}>
        <div className={styles.modalFormContainer}>
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
        </div>
      </form>
    </div>
  );

  const formBuilderPresenter = <FormBuilderPresenter {...formState} />;

  return <Fragment>{withHeader ? formBuilderPresenter : createForm}</Fragment>;
};

export default connect(
  mapStateToProps,
  { setFormInfo: formBuilderActions.setFormInfo },
)(FormBuilderContainer);
