import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { documentRevisionsActions } from "../documentRevisions";
import { TRAINING_RECORD_ROOT_URL } from "./constants";
import { TrainingPlanTransition, TrainingTransitionRequestBody } from "./types";

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

export default {
  applyTransition,
};
