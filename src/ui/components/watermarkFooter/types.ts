import { WatermarkRequest } from "../../../state/ducks/attachments";
import { TextProps } from "../Text";

export interface WatermarkResponse {
  success: boolean;
  message: TextProps;
  data: WatermarkRequest;
}
