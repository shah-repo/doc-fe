import React, { useState } from "react";
import TaskListContainer from "./TaskList.container";

// const mapStateToProps = (state: ApplicationState): StateProps => ({
//   currentUserEmail: authSelectors.currentUserEmail(state),
// });

const TaskListPresenter: React.FunctionComponent = () => {
  const [user, setUser] = useState();

  const selectUserHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser(e.target.value);
  };

  return (
    <div style={{ maxWidth: "640px", margin: "150px auto" }}>
      <select
        onChange={selectUserHandler}
        defaultValue="1"
        // tslint:disable-next-line: jsx-alignment
        style={{ marginBottom: "50px" }}>
        <option value="1" disabled={true}>
          Select User
        </option>
        <option value="admin">Admin</option>
        <option value="mathew">Mathew</option>
        <option value="smith">Smith</option>
      </select>
      <TaskListContainer currentUser={user} currentUserEmail={user} />
    </div>
  );
};

export default TaskListPresenter;
