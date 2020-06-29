import { find, sortBy } from "lodash";
import { action, observable, set } from "mobx";
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBTaskItem } from "..";
import { Employee } from "../../../state/ducks/company";

export class FBTaskState {
  @observable public tasks?: FBTaskItem[];
  public approversApi = new FBAutocompleteAsyncState(FBAutocompleteAsyncOption.approver);

  public constructor(tasks?: FBTaskItem[]) {
    this.tasks = tasks;
  }

  @action public setTask = (task?: FBTaskItem) => {
    if (!task) { return; }
    const stateTask = find(this.tasks, { id: task.id });
    if (stateTask) {
      return this.updateTask(task);
    }
    const collection = sortBy([...this.tasks || [], ...[task]], "index");
    set(this, "tasks", collection);
  };

  public getTask = (index = 0): FBTaskItem | undefined => find(this.tasks, { index });

  public approverName(id: string): Employee | undefined {
    return this.approversApi.sliceValue(id);
  }

  private updateTask = (task: FBTaskItem) => {
    const collection = [...this.tasks || []];
    collection[task.index] = task;
    set(this, "tasks", collection);
  };
}

export default FBTaskState;
