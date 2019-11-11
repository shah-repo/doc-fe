import { generatePath } from "react-router-dom";
import { TRAINING_DETAIL_URL } from "../constants/urls";
import { TrainingRouteParams } from "./types";

const generateTrainingPath = (path: string, routeParams: TrainingRouteParams) =>
  generatePath(path, { ...routeParams });

export const generateTrainingDetailPath = (trainingId: string) =>
  generateTrainingPath(TRAINING_DETAIL_URL, { trainingId });
