import React, { useEffect, useState } from "react";
import styles from "./FormBuilder.module.css";
import FormFieldEditor from "./FormFieldEditor";
import { formReducerType } from "../../state/ducks/formBuilder/reducer";
import { connect } from "react-redux";
import { formBuilderActions } from "../../state/ducks/formBuilder";

const placeholder = document.createElement("div");
placeholder.className = styles.placeholder;

interface StateProps {
  formBuilderState: formReducerType;
}

interface DispatchProps {
  UPDATE_DRAG_DROP_FIELDS: typeof formBuilderActions.updateDragAndDropFields;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  formBuilderState,
});

type FormEdtiroPresenterProps = StateProps & DispatchProps;

const FormEditorPresenter: React.FunctionComponent<
  FormEdtiroPresenterProps
> = ({ formBuilderState, UPDATE_DRAG_DROP_FIELDS }) => {
  const [fields, setFields] = useState(formBuilderState.elements);

  useEffect(() => {
    setFields(formBuilderState.elements);
  }, [formBuilderState.elements]);

  let dragged: any;
  let container: any;

  const dragStart = (e: any) => {
    dragged = e.currentTarget;
    dragged.style.display = "block";
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("FormField", dragged);
  };

  const dragEnd = (e: any) => {
    const tempFields = fields;
    if (dragged) {
      dragged.style.display = "block";
    }
    if (container && container.className.includes("dragContainer")) {
      container.parentNode.removeChild(placeholder);
      const from = Number(dragged.dataset.id);
      let to = Number(container.dataset.id);
      if (from < to) {
        to--;
      }
      tempFields.splice(to, 0, tempFields.splice(from, 1)[0]);
      UPDATE_DRAG_DROP_FIELDS([...tempFields]);
    }
  };

  const dragOver = (e: any) => {
    e.preventDefault();
    if (dragged) {
      dragged.style.display = "none";
    }

    if (e.target.className === "placeholder") {
      return;
    }
    if (
      e.target.className &&
      typeof e.target.className.includes !== "undefined" &&
      e.target.className.includes("dragContainer")
    ) {
      container = e.target;
      container.parentNode.insertBefore(placeholder, container);
    }
  };

  const Forms = fields.map((elem: any, i: any) => {
    return (
      <FormFieldEditor
        onDragStart={dragStart}
        onDragEnd={dragEnd}
        closed={elem.closed}
        diff={elem.diff}
        key={i}
        order={i}
        type={elem.type}
        config={elem.config}
        editMode={true}
      />
    );
  });

  return (
    <div className={styles.formEditorContainer} onDragOver={dragOver}>
      {Forms}
      <div data-id={10000} className={styles.last + " dragContainer"} />
    </div>
  );
};

export default connect(
  mapStateToProps,
  { UPDATE_DRAG_DROP_FIELDS: formBuilderActions.updateDragAndDropFields },
)(FormEditorPresenter);
