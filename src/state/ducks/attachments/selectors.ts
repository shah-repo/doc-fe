import { WatermarkState } from ".";
import { ApplicationState } from "../../reducers";

const getWatermarks = (state: ApplicationState): WatermarkState =>
  state.attachments.watermarks;

export default {
  getWatermarks,
};
