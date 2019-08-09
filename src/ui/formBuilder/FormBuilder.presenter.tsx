import React, { Fragment, useEffect, useState } from "react";
import Modal from "./components/modal/Modal";
import styles from "./FormBuilder.module.css";
import FormViewerContainer from "./FormViewer.container";
import FormEditorContainer from "./FormEditor.container";
import FormHeaderContainer from "./FormHeader.container";
import FormImportExport from "./FormImportExport";
import { connect } from "react-redux";
import { formReducerType } from "../../state/ducks/formBuilder/reducer";

interface FormBuilderPresenterProps {
  modalState: any;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  modalState: formBuilderState.modalState,
});

const FormBuilderPresenter: React.FunctionComponent<
  FormBuilderPresenterProps
> = ({ modalState }) => {
  const [viewFormMode, setViewFormMode] = useState(false);

  const builderContainer = (
    <Fragment>
      <FormEditorContainer />
      <FormImportExport />
    </Fragment>
  );

  const toggleView = () => {
    setViewFormMode(!viewFormMode);
  };

  return (
    <div className="FormBuilder">
      <FormHeaderContainer />
      {modalState.show ? <Modal /> : null}
      {viewFormMode ? <FormViewerContainer /> : builderContainer}

      <button onClick={toggleView} className={styles.viewForm}>
        VIEW {viewFormMode ? "BUILDER" : "FORM"}
      </button>
    </div>
  );
};

export default connect(mapStateToProps)(FormBuilderPresenter);
