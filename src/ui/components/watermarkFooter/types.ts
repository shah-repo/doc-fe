import { WatermarkRequest } from "../../../state/ducks/attachments/types";
import { TextProps } from "../Text";

export interface WatermarkResponse {
  success: boolean;
  message: TextProps;
  data: WatermarkRequest;
}
