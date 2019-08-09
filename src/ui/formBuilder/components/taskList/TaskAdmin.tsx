import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "./Tasks.module.css";
import { ReactComponent as DeletIcon } from "../../formBuilder/icons/icon_delete.svg";
import { ReactComponent as EditIcon } from "../../formBuilder/icons/icon_edit.svg";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

// const mapStateToProps = (state: ApplicationState): StateProps => ({
//   currentUserEmail: authSelectors.currentUserEmail(state),
// });

interface LocalProps {
  task: {
    title: string;
    description: string;
    assignee: string;
    due_date: string;
    status: string;
  };
  id: any;
}

interface DispatchProps {
  editTask: any;
  deleteTask: any;
}

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    editTask: (task: any, id: any) => dispatch({ type: "EDIT_TASK", task, id }),
    deleteTask: (id: any) => dispatch({ type: "DELETE_TASK", id }),
  };
};

export type TaskProps = DispatchProps & LocalProps;

const Task: React.FunctionComponent<TaskProps> = ({
  id,
  task,
  editTask,
  deleteTask,
}) => {
  const [currentTask, setTask] = useState(task);
  const [showForm, toggleForm] = useState(false);

  useEffect(() => {
    setTask(task);
  }, [task]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    editTask(currentTask, id);
    toggleForm(false);
  };

  const handleDelete = () => {
    deleteTask(id);
  };

  const toggleShowForm = () => {
    toggleForm(true);
  };

  const closeFormHandler = () => {
    toggleForm(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setTask({ ...currentTask, [name]: value });
  };

  const handleDayChange = (day: any) => {
    setTask({ ...currentTask, due_date: day.toLocaleDateString() });
  };

  const singleTaskContainer = (
    <div className={styles.singleTaskContainer}>
      <div className={styles.taskControls}>
        <EditIcon onClick={toggleShowForm} className={styles.editControl} />
        <DeletIcon onClick={handleDelete} className={styles.deleteControl} />
      </div>
      <h3>{currentTask.title}</h3>
      <p> {currentTask.description}</p>
      <div className={styles.taskBottomInfo}>
        <span>
          <strong>Assigned to: </strong> {currentTask.assignee}
        </span>
        <span>
          <strong>Due Date: </strong>
          {currentTask.due_date}{" "}
        </span>
        <span>
          <strong>Status: </strong>
          {currentTask.status}
        </span>
      </div>
    </div>
  );

  const form = (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label>Title</label>
            <input
              name="title"
              type="text"
              onChange={handleChange}
              value={currentTask.title}
            />
          </div>
          <div className={styles.formColumn}>
            <label>Description</label>
            <input
              type="text"
              name="description"
              onChange={handleChange}
              value={currentTask.description}
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label>Assigned to</label>
            <input
              type="text"
              name="assignee"
              onChange={handleChange}
              value={currentTask.assignee}
            />
          </div>
          <div className={styles.formColumn}>
            <label>Due date</label>
            <DayPickerInput
              format={""}
              onDayChange={handleDayChange}
              value={currentTask.due_date}
            />
          </div>
          <div className={styles.formColumn}>
            <label>Status</label>
            <select
              name="status"
              onChange={handleChange}
              value={currentTask.status}>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div className={styles.formButtonContainer}>
          <button className={styles.buttonCancel} onClick={closeFormHandler}>
            Cancel
          </button>
          <button className={styles.saveButton}> Save </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className={styles.showTaskContainer}>
      {showForm ? form : singleTaskContainer}
    </div>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(Task);
