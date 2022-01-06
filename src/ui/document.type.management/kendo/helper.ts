import { toastError } from "../../components/notifications";
import { parseJSON } from "../transform";

const checkIfJSONObject = (value: string, title: string) => {
  try {
    const o = parseJSON(value);
    if (o && typeof o === "object") {
      return o;
    }
  }
  catch (e) {
    toastError(`Please Enter Valid ${title}`);
    return false;
  }
};
export default checkIfJSONObject;

