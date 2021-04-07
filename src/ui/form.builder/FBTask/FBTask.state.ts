import { filter, find, findIndex, omit } from "lodash";
import { action, observable, set } from "mobx";
import { FBClosingNoteProps, FBTaskItem, FBTaskItemStatus } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBTaskState extends FBRequest<FBTaskItem, FBTaskItem | FBClosingNoteProps> {
  @observable public canAddTask = true;

  @action public handleAddTask = (canAdd: boolean) => {
    set(this, "canAddTask", canAdd);
  };

  public tasks?: FBTaskItem[];

  public constructor(tasks?: FBTaskItem[]) {
    super();
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
    this.addTask(task);
  };

  public removeTask = (task?: FBTaskItem) => {
    if (!task) { return; }
    this.set({
      url: FBEndpoint.TaskAbandon,
      urlValues: { id: task.id },
      body: task,
      method: "post",
    });
  };

  public finishTask = (task?: FBClosingNoteProps) => {
    if (!task) { return; }
    this.set({
      url: FBEndpoint.TaskDone,
      urlValues: { id: task.id },
      body: omit(task, "id"),
      method: "post",
    });
  };

  public getTask = (id?: string): FBTaskItem | undefined =>
    this.tasks?.find((task) => task.id === id);

  public onSuccess() {
    if (!this.data) { return; }
    const { id } = this.data;
    switch (this.method) {
      case "post": {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tasks = filter(this.tasks, (t) => t.id !== id);
        const { status = "DRAFT" } = this.data || {};
        const setTasks: Partial<Record<FBTaskItemStatus | "default", () => any>> = {
          ABANDONED: () => this.setTasks(tasks),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          default: () => this.setTasks([...tasks, ...[this.data!]]),
        };
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (setTasks[status] || setTasks.default)?.();
        break;
      }
      case "patch": {
        const tasks = this.tasks || [];
        const indexOf = findIndex(tasks, { id });
        tasks[indexOf] = this.data;
        this.setTasks(tasks);
        break;
      }
      default: break;
    }
    super.onSuccess();
  }

  private addTask = (task: FBTaskItem) => {
    this.setUrl(FBEndpoint.Tasks);
    this.setBody(task);
    this.post();
  };

  private updateTask = (task: FBTaskItem) => this.set({
    url: FBEndpoint.Task,
    urlValues: { id: task.id },
    body: { ...omit(task, ["id", "type", "partOf"]) },
    method: "patch",
  });
}

export default FBTaskState;
