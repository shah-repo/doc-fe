import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { documentRevisionsActions } from "../documentRevisions";
import { TRAINING_RECORD_ROOT_URL } from "./constants";
import { TrainingPlanTransition, TrainingRequestBody, TrainingTransitionRequestBody } from "./types";

const applyTransition = (
  id: string,
  documentRevisionId: string,
  body: TrainingTransitionRequestBody,
  transition: TrainingPlanTransition,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${TRAINING_RECORD_ROOT_URL}/${id}/${transition}`,
  method: "post",
  data: body,
  password: body.password,
  onSuccess: (trainingRecord, dispatch) => {
    dispatch(documentRevisionsActions.load(documentRevisionId));
  },
  handlers,
});

const completeSelfTaughtTraining = (
  id: string,
  body: TrainingRequestBody,
  values: TrainingTransitionRequestBody,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${TRAINING_RECORD_ROOT_URL}/self_taught/complete`,
  method: "post",
  data: body,
  password: values.password,
  onSuccess: (trainingRecord, dispatch) => {
    dispatch(documentRevisionsActions.load(id));
  },
  handlers,
});

export default {
  applyTransition,
  completeSelfTaughtTraining,
};
