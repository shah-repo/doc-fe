import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { formReducerType } from "../../state/ducks/formBuilder/reducer";
import fieldStyles from "./components/basic/BasicFields.module.css";
import Modal from "./components/modal/Modal";
import styles from "./FormBuilder.module.css";
import FormEditorContainer from "./FormEditor.container";
import FormHeaderContainer from "./FormHeader.container";
import FormImportExport from "./FormImportExport";
import FormViewerContainer from "./FormViewer.container";

interface FormBuilderPresenterProps {
  modalState: any;
  inDialog?: boolean;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  modalState: formBuilderState.modalState,
});

const FormBuilderPresenter: React.FunctionComponent<
  FormBuilderPresenterProps
> = ({ modalState, inDialog = true }) => {
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
    <div className={fieldStyles.FormBuilder}>
      <div style={{paddingBottom: "60px"}}>
        <button onClick={toggleView} className={styles.viewForm}>
          VIEW {viewFormMode ? "BUILDER" : "FORM"}
        </button>
      </div>
      {inDialog && <FormHeaderContainer />}
      {modalState.show && <Modal />}
      {viewFormMode && <FormViewerContainer />}
      {!viewFormMode && builderContainer}
    </div>
  );
};

export default connect(mapStateToProps)(FormBuilderPresenter);
