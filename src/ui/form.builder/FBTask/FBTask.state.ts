// eslint-disable-next-line max-classes-per-file
import { find, omit } from "lodash";
import { FBClosingNoteProps } from ".";
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBTaskApi, FBTaskItem } from "..";
import { Employee } from "../../../state/ducks/company";
import { FBEndpoint } from "../defaults/FBEndpoint";

export class FBTaskState {
  public tasks?: FBTaskItem[];
  public approversApi = new FBAutocompleteAsyncState(FBAutocompleteAsyncOption.approver);
  public taskApi = new FBTaskApi(this);

  public constructor(tasks?: FBTaskItem[]) {
    this.tasks = tasks;
  }

  public setTasks = (tasks?: FBTaskItem[]) => {
    this.tasks = tasks;
  };

  public setTask = (task?: FBTaskItem) => {
    if (!task) { return; }
    const stateTask = find(this.tasks, { id: task.id });
    if (stateTask) {
      return this.updateTask(task);
    }
    this.taskApi.setUrl(FBEndpoint.Tasks);
    this.taskApi.setBody(task);
    this.taskApi.post();
  };

  public removeTask = (task?: FBTaskItem) => {
    if (!task) { return; }
    this.taskApi.setTemplateUrl(FBEndpoint.TaskAbandon, { id: task.id });
    this.taskApi.setBody(task);
    this.taskApi.post();
  };

  public taskDone = (task?: FBClosingNoteProps) => {
    if (!task) { return; }
    this.taskApi.setTemplateUrl(FBEndpoint.TaskDone, { id: task.id });
    this.taskApi.setBody(omit(task, "id"));
    this.taskApi.post();
  };

  public getTask = (id?: string): FBTaskItem | undefined => find(this.tasks, { id });

  public approverName(id: string): Employee | undefined {
    return this.approversApi.sliceValue(id);
  }

  private updateTask = (task: FBTaskItem) => {
    this.taskApi.setTemplateUrl(FBEndpoint.Task, { id: task.id });
    this.taskApi.setBody({ ...omit(task, ["id", "type", "partOf"]) });
    this.taskApi.patch();
  };
}

export default FBTaskState;
