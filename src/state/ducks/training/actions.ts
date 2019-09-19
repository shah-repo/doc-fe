import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import {
  TRAINING_PLAN_ROOT_URL,
  TRAINING_RECORD_ROOT_URL,
} from "./constants";
import {
  TrainingPlan,
  TrainingPlanTransition,
  TrainingTransitionRequestBody,
} from "./types";

const load = (id: string): ApiAction<TrainingPlan> => apiAction({
  url: `${TRAINING_PLAN_ROOT_URL}/${id}`,
  method: "get",
});

const applyTransition = (
  id: string,
  body: TrainingTransitionRequestBody,
  transition: TrainingPlanTransition,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${TRAINING_RECORD_ROOT_URL}/${id}/${transition}`,
  method: "post",
  data: body,
  handlers,
});

export default {
  load,
  applyTransition,
};
