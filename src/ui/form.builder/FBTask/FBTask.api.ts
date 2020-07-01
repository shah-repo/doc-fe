import { cloneDeep, filter, findIndex } from "lodash";
import { FBTaskItem, FBTaskState } from "..";
import FBRequest from "../FBApi/FBApi.request";

export class FBTaskApi extends FBRequest<FBTaskItem, FBTaskItem> {
  private taskState?: FBTaskState;

  public constructor(taskState?: FBTaskState) {
    super();
    this.taskState = taskState;
  }

  public onSuccess() {
    if (!this.data) { return; }
    switch (this.method) {
      case "post": {
        if (this.data.status === "ABANDONED") {
          this.taskState?.setTasks(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            filter(this.taskState?.tasks, (t) => t.id !== this.data!.id)
          );
          return;
        }
        const tasks = [...this.taskState?.tasks || [], ...[this.data]];
        this.taskState?.setTasks(tasks);
        break;
      }
      case "patch": {
        const tasks = cloneDeep(this.taskState?.tasks) || [];
        const indexOf = findIndex(tasks, { id: this.data.id });
        tasks[indexOf] = this.data;
        this.taskState?.setTasks(tasks);
        break;
      }
      default: break;
    }
    super.onSuccess();
  }
}

export default FBTaskApi;
