import React, { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { connect } from "react-redux";
import { ApplicationState } from "../../../state/ducks/tasksList/reducer";
import TaskAdmin from "./TaskAdmin";
import styles from "./Tasks.module.css";

interface LocalProps {
  currentUser: string;
}

interface StateProps {
  tasks: any;
}

interface DispatchProps {
  addTask: any;
}

const mapStateToProps = ({ tasks }: ApplicationState): StateProps => ({
  tasks,
});

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    addTask: (task: any) => dispatch({ type: "ADD_TASK", payload: task }),
  };
};

export type TaskListPresenterProps = LocalProps & StateProps & DispatchProps;

const TaskListPresenter: React.FunctionComponent<TaskListPresenterProps> = ({
  currentUser,
  addTask,
  tasks,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const showFormHandler = () => {
    setShowForm(true);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    addTask(task);
    setShowForm(false);
  };

  const closeFormHandler = () => {
    setShowForm(false);
  };

  const handleDayChange = (day: any) => {
    setTask({ ...task, due_date: day ? day.toLocaleDateString() : "" });
  };

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
              required={true}
            />
          </div>
          <div className={styles.formColumn}>
            <label>Description</label>
            <input
              type="text"
              name="description"
              onChange={handleChange}
              required={true}
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
              required={true}
            />
          </div>
          <div className={styles.formColumn}>
            <label>Due date</label>
            <DayPickerInput
              format={""}
              onDayChange={handleDayChange}
              inputProps={{ required: true }}
            />
          </div>
          <div className={styles.formColumn}>
            <label>Status</label>
            <select
              name="status"
              onChange={handleChange}
              defaultValue={""}
              // tslint:disable-next-line: jsx-alignment
              required={true}>
              <option value="" disabled={true}>
                Choose Status
              </option>
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

  // tslint:disable-next-line: no-shadowed-variable
  const taskList = tasks.map((task: any, i: any) => (
    <TaskAdmin key={i} id={i} task={task} />
  ));

  return (
    <div className={styles.implementationPlanContainer}>
      <div className={styles.topImplementationContainer}>
        <h2 className={styles.implementationPlanTitle}>Implementation Plan</h2>
        <span className={styles.controls} onClick={showFormHandler}>
          ADD TASK
        </span>
      </div>
      {taskList}
      {showForm ? form : null}
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListPresenter);
