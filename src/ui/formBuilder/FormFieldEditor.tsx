import React from "react";
import { connect } from "react-redux";
import { ReactComponent as MoveHandle } from "../../assets/images/formBuilder/icon_move.svg";
import { formBuilderActions } from "../../state/ducks/formBuilder";
import { FormBuilderFieldProps } from "../../state/ducks/formBuilder/types";
import ApprovalCollection from "./components/basic/ApprovalCollection";
import CheckBox from "./components/basic/Checkbox";
import DatePicker from "./components/basic/DatePicker";
import FileUpload from "./components/basic/FileUpload";
import HyperLink from "./components/basic/HyperLink";
import MultipleCheckbox from "./components/basic/MultipleCheckbox";
import MultipleHyperLink from "./components/basic/MultipleHyperLink";
import MultiplePackaging from "./components/basic/MultiplePackaging";
import Numeric from "./components/basic/Numeric";
import Paragraph from "./components/basic/Paragraph";
import RadioField from "./components/basic/Radio";
import SingleLine from "./components/basic/SingleLine";
import TextArea from "./components/basic/TextArea";
import ActionButton from "./components/buttons/ActionButton";
import Lists from "./components/lists/Lists";
import CloseSection from "./components/sections/CloseSection";
import Section from "./components/sections/Section";
import SubSection from "./components/sections/SubSection";
import TaskListContainer from "./components/taskList/TaskList.container";
import styles from "./FormBuilder.module.css";
// import TaskListContainer from "./components/taskList/TaskList.container";

interface DispatchProps {
  deleteField: typeof formBuilderActions.deleteField;
  editField: typeof formBuilderActions.editField;
  showModal: typeof formBuilderActions.showModal;
}

type FormFieldProps = FormBuilderFieldProps & DispatchProps;

const FormFieldEditor: React.FunctionComponent<FormFieldProps> = ({
  type,
  closed,
  config,
  order,
  onDragEnd,
  onDragStart,
  diff,
  editMode,
  deleteField,
  editField,
  showModal,
}) => {
  let formField;
  switch (type) {
    case "section":
      formField = <Section title={config.title} closed={closed} />;
      break;
    case "subSection":
      formField = <SubSection title={config.title} closed={closed} />;
      break;
    case "singleLine":
      formField = (
        <SingleLine
          title={config.title}
          placeholder={config.placeholder || ""}
          closed={closed}
          editMode={true}
        />
      );
      break;
    case "multiLine":
      formField = (
        <TextArea
          title={config.title}
          placeholder={config.placeholder || ""}
          closed={closed}
          editMode={true}
        />
      );
      break;
    case "radio":
      formField = (
        <RadioField
          title={config.title}
          options={config.options || []}
          closed={closed}
          editMode={true}
        />
      );
      break;
    case "numeric":
      formField = (
        <Numeric
          title={config.title}
          placeholder={config.placeholder || ""}
          tolerance={config.tolerance || false}
          toleranceType={config.toleranceType || ""}
          min={config.min}
          max={config.max}
          closed={closed}
          editMode={true}
        />
      );
      break;
    case "checkbox":
      formField = (
        <CheckBox
          title={config.title}
          notes={config.notes}
          closed={closed}
          editMode={true}
        />
      );
      break;
    case "datepicker":
      formField = (
        <DatePicker
          title={config.title}
          closed={closed}
          values={null}
          updateValue={null}
          currentIndex={order}
          editMode={true}
        />
      );
      break;

    case "actionItems":
      formField = (
        <TaskListContainer
          currentUserEmail="admin@enlil.com"
          currentUser="admin"
        />
      );
      break;
    case "hyperlink":
      formField = (
        <HyperLink
          title={config.title}
          url={config.url || ""}
          closed={closed}
        />
      );
      break;
    case "multipleHyperlink":
      formField = (
        <MultipleHyperLink
          editMode={true}
          title={config.title}
          closed={closed}
        />
      );
      break;
    case "paragraph":
      formField = (
        <Paragraph
          textType={config.textType || ""}
          text={config.text || ""}
          closed={closed}
        />
      );
      break;
    case "fileUpload":
      formField = (
        <FileUpload editMode={true} title={config.title} closed={closed} />
      );
      break;
    case "multipleCheckbox":
      formField = (
        <MultipleCheckbox
          title={config.title}
          options={config.options || []}
          closed={closed}
          editMode={true}
        />
      );
      break;
    case "multiplePackaging":
      formField = (
        <MultiplePackaging
          editMode={true}
          title={config.title}
          closed={closed}
        />
      );
      break;
    case "approvalCollection":
      formField = (
        <ApprovalCollection
          editMode={true}
          title={config.title}
          closed={closed}
        />
      );
      break;
    case "qa":
    case "operations":
      formField = <ActionButton title={config.title} closed={closed} />;
      break;
    case "standards":
    case "finishedGoods":
    case "lots":
    case "mpis":
    case "parts":
    case "sops":
    case "suppliers":
      formField = (
        <Lists
          title={config.title}
          closed={closed}
          currentIndex={order}
          editMode={true}
        />
      );
      break;
    case "custom":
      formField = (
        <Lists
          title={config.title}
          options={config.options}
          closed={closed}
          currentIndex={order}
          editMode={true}
        />
      );
      break;

    case "closeSection":
      formField = (
        <CloseSection
          editMode={true}
          currentIndex={order}
          diff={diff}
          closed={closed}
        />
      );
      break;
  }

  const showModalHandler = () => {
    showModal(order);
  };

  const editFieldHandler = () => {
    editField(type, config, order, closed);
  };

  const removeField = () => {
    deleteField(order);
  };
  const showEdit = [
    "standards",
    "finishedGoods",
    "lots",
    "mpis",
    "parts",
    "sops",
    "suppliers",
    "closeSection",
  ].includes(type);

  const editTemp = (
    <div className={styles.edit} onClick={editFieldHandler}>
      Edit
    </div>
  );

  const topControls = (
    <div className={styles.topControls}>
      {!showEdit ? editTemp : null}
      <div className={styles.delete} onClick={removeField}>
        Delete
      </div>
    </div>
  );

  const width = ` ${styles[config ? config.colWidth : ""]}`;
  const sectionStyle = type === "section" ? ` ${styles[type]}` : "";
  const containerStyle =
    styles.fieldContainer + width + sectionStyle + " dragContainer";
  const hideTopControls = closed && type === "closeSection";
  return (
    <div
      data-id={order}
      draggable={true}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      // eslint-disable-next-line: jsx-alignment
      className={containerStyle}
    >
      {hideTopControls ? null : topControls}
      {formField}
      <div className={styles.moveHandle}>
        <MoveHandle />
      </div>
      <div className={styles.addField} onClick={showModalHandler}>
        Add Field
      </div>
    </div>
  );
};

export default connect(
  null,
  {
    deleteField: formBuilderActions.deleteField,
    editField: formBuilderActions.editField,
    showModal: formBuilderActions.showModal,
  },
)(FormFieldEditor);
