import { attachmentsActions } from "../../../../../state/ducks/attachments";
import { store } from "../../../../../state/store";
import useAsync from "../../../../hooks/useAsync";

const NUMBER_OF_RETRIES = 3;
const RETRY_TIME = 5000;

class WatermarkRequest {
  private numberOfRetries = 0;
  private timer;
  private async;
  private asyncAction;

  constructor(
    private setResult: any,
  ) {
    this.asyncAction = (requestId: string) => {
      return store.dispatch(attachmentsActions.downloadWatermarkedFile(requestId, this.async));
    };
    this.async = useAsync({
      onSuccess: (data: any) => {
        if (data!.status === "DONE") {
          setResult({
            success: true,
            message: "Ready to download",
            data,
          });
          this.disconnect();
        }
      },
      onError: (message) => {
        console.log(this);
        this.disconnect();
        setResult({
          success: false,
          message,
        });
      },
    });
  }

  public execute(request: any) {
    console.log("execute");
    this.timer = setInterval(() => {
      this.numberOfRetries++;

      if (this.numberOfRetries > NUMBER_OF_RETRIES) {
        this.setResult({
          success: false,
          message: `Document  wasn't processed`,
        });
        this.disconnect();
        return;
      }
      this.asyncAction(request.id);
    }, RETRY_TIME);
    this.disconnect.bind(this);
  }

  public disconnect() {
    console.log(this.timer);
    clearInterval(this.timer);
  }
}

export default WatermarkRequest;
