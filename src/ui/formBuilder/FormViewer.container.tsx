import React, { Fragment } from "react";
import styles from "./FormBuilder.module.css";
import FormViewerPresenter from "./FormViewer.presenter";
import { connect } from "react-redux";
import { formReducerType } from "../../state/ducks/formBuilder/reducer";

interface StateProps {
  formBuilderState: formReducerType;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  formBuilderState,
});

const FormViewerContainer: React.FunctionComponent<StateProps> = ({
  formBuilderState,
}) => {
  const placeholder = (
    <div className={styles.formEditorContainer}>
      <span>NO FIELD</span>
    </div>
  );

  const Presenter =
    formBuilderState.elements.length > 0 ? (
      <FormViewerPresenter elements={formBuilderState.elements} />
    ) : (
      placeholder
    );

  return <Fragment>{Presenter}</Fragment>;
};

export default connect(mapStateToProps)(FormViewerContainer);
