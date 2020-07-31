import React from "react";
import { connect } from "react-redux";
import { formBuilderActions } from "../../state/ducks/formBuilder";
import styles from "./FormBuilder.module.css";
import FormFieldViewer from "./FormFieldViewer";

interface OwnProps {
  elements: any;
}

interface DispatchProps {
  UPDATE_FIELD_VALUE: typeof formBuilderActions.updateFieldValue;
}

type FormViewerProps = OwnProps & DispatchProps;

const FormViewer: React.FunctionComponent<FormViewerProps> = ({
  elements,
  UPDATE_FIELD_VALUE,
}) => {
  const Fields = elements.map((elem: any, i: any) => (
    <FormFieldViewer
      closed={elem.closed}
      diff={elem.diff}
      key={i}
      order={i}
      type={elem.type}
      config={elem.config}
      editMode={false}
      values={elem.values}
      updateValue={UPDATE_FIELD_VALUE}
    />
  ));
  return <div className={styles.formEditorContainer}> {Fields} </div>;
};

export default connect(
  null,
  { UPDATE_FIELD_VALUE: formBuilderActions.updateFieldValue },
)(FormViewer);
