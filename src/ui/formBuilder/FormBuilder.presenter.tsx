import React, { Fragment } from "react";
import { connect } from "react-redux";
import { formBuilderActions } from "../../state/ducks/formBuilder";
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
  viewFormMode: any;
  inDialog?: boolean;
}

interface DispatchProps {
  fbFormMode: typeof formBuilderActions.viewFormMode;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  modalState: formBuilderState.modalState,
  viewFormMode: formBuilderState.viewFormMode,
});

const FormBuilderPresenter: React.FunctionComponent<
  FormBuilderPresenterProps & DispatchProps
> = ({ viewFormMode, modalState, inDialog = true, fbFormMode }) => {
  // const [viewFormMode, setViewFormMode] = useState(false);

  const builderContainer = (
    <Fragment>
      <FormEditorContainer />
      {inDialog && <FormImportExport />}
    </Fragment>
  );

  const toggleView = () => {
    fbFormMode(!viewFormMode);
  };

  return (
    <div className={fieldStyles.FormBuilder}>
      {inDialog && <FormHeaderContainer />}
      {modalState.show && <Modal />}
      {viewFormMode && <FormViewerContainer />}
      {!viewFormMode && builderContainer}
      <div style={{ paddingTop: "30px" }}>
        <button type="button" onClick={toggleView} className={styles.viewForm}>
          VIEW {viewFormMode ? "BUILDER" : "FORM"}
        </button>
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  {
    fbFormMode: formBuilderActions.viewFormMode,
  },
)(FormBuilderPresenter);
