import { toastSuccess } from "../../components/notifications";
import FBRequest from "../FBApi/FBApi.request";

class FBActionFieldState extends FBRequest<null, any> {

  public constructor(url: string) {
    super();
    this.url = url;
  }

  public onSuccess = () => {
    toastSuccess("Message sent.");
  };
}

export default FBActionFieldState;
