import React from "react";
import { ImplementationPlanTask } from "../../types";
import Text from "../../../../components/Text";
import Date from "../../../../components/Date";

interface Props {
  task: ImplementationPlanTask;
  removeTask: (index: number) => () => void;
}

const TaskPresenter: React.FunctionComponent<Props> = ({
  task, removeTask,
}) => {
  return (
    <div style={{ border: '1px solid lightgray', margin: '10px 0', padding: 10, lineHeight: 2 }}>
      <div>{task.title}</div>
      <div>{task.description}</div>
      <div style={{ marginTop: 10, color: 'gray' }}>
        <span style={{ marginRight: 20 }}>
          <Text translation="common.assignedTo" />:&nbsp;
          {task.assigned.map((assignee) => `${assignee.name}, `)}
        </span>
        <span>
          <Text translation="common.dueDate" />:&nbsp;
          <Date value={task.dueDate} />
        </span>
      </div>
    </div>
  )
};

export default TaskPresenter;
