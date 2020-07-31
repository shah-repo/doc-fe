import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formBuilderActions } from "../../state/ducks/formBuilder";
import { formReducerType } from "../../state/ducks/formBuilder/reducer";
import styles from "./FormBuilder.module.css";
import FormFieldEditor from "./FormFieldEditor";

const placeholder = document.createElement("div");
placeholder.className = styles.placeholder;

interface StateProps {
  formBuilderState: formReducerType;
}

interface DispatchProps {
  updateDragAndDropFields: typeof formBuilderActions.updateDragAndDropFields;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  formBuilderState,
});

type FormEdtiroPresenterProps = StateProps & DispatchProps;

const FormEditorPresenter: React.FunctionComponent<
  FormEdtiroPresenterProps
> = ({ formBuilderState, updateDragAndDropFields }) => {
  const [fields, setFields] = useState(formBuilderState.elements);

  useEffect(() => {
    setFields(formBuilderState.elements);
  }, [formBuilderState.elements]);

  let dragged: HTMLElement;
  let container: HTMLElement;

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    dragged = e.currentTarget as HTMLDivElement;
    dragged.style.display = "block";
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("FormField", dragged.toString());
  };

  const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const tempFields = fields;
    if (dragged) {
      dragged.style.display = "block";
    }
    if (container && container.className.includes("dragContainer")) {
      container.parentNode!.removeChild(placeholder);
      const from = Number(dragged.dataset.id);
      let to = Number(container.dataset.id);
      if (from < to) {
        to--;
      }
      tempFields.splice(to, 0, tempFields.splice(from, 1)[0]);
      updateDragAndDropFields([...tempFields]);
    }
  };

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragged) {
      dragged.style.display = "none";
    }

    if (e.currentTarget.className === "placeholder") {
      return;
    }
    if (
      e.currentTarget.className &&
      typeof e.currentTarget.className.includes !== "undefined" &&
      e.currentTarget.className.includes("dragContainer")
    ) {
      container = e.currentTarget;
      container.parentNode!.insertBefore(placeholder, container);
    }
  };

  const Forms = fields.map((elem: any, i: number) => (
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
  ));

  return (
    <div className={styles.formEditorContainer} onDragOver={dragOver}>
      {Forms}
      <div data-id={10000} className={styles.last + " dragContainer"} />
    </div>
  );
};

export default connect(
  mapStateToProps,
  { updateDragAndDropFields: formBuilderActions.updateDragAndDropFields },
)(FormEditorPresenter);
