import { ApplicationState } from "../../reducers";
import { WatermarkState } from "./types";

const getWatermarks = (state: ApplicationState): WatermarkState =>
  state.attachments.watermarks;

export default {
  getWatermarks,
};
