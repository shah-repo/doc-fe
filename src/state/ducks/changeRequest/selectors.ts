import { createSelector } from "reselect";
import striptags from "striptags";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";
import { OptionType } from "../../../ui/components/forms/fields/Autocomplete/types";
import { Audit } from "./types";
import { stripTags } from "../../../common/utils/helpers";
import _ from "lodash";

const allIds = (state: ApplicationState) => state.changeRequests.allIds;
const byId = (state: ApplicationState) => state.changeRequests.byId;
const approversById = (state: ApplicationState) => state.changeRequests.approversById;
const approversAllIds = (state: ApplicationState) => state.changeRequests.approversAllIds;
const auditsByCRId = (state: ApplicationState) => state.changeRequests.auditsByCRId;
const auditsAllId = (state: ApplicationState) => state.changeRequests.auditsAllId;

const getChangeRequestsList = createSelector(
  allIds, byId,
  (ids, changeRequests) => (
    ids.map((id) => {
      const cr = _.cloneDeep(changeRequests[id]);
      cr.description = stripTags(changeRequests[id].description);
      
      return cr;
    })
  ),
);

const getApproversListForAssessmentForm = createSelector(
  approversAllIds, approversById,
  (ids, approvers): OptionType[] => ids.map((id) => ({ value: approvers[id].email, label: approvers[id].name })),
);

const getAssignessList = createSelector(
  approversAllIds, approversById,
  (ids, approvers): OptionType[] => ids.map((id) => ({ value: approvers[id].id, label: approvers[id].name })),
);

const getChangeRequest = (state: ApplicationState, changeRequestId: string) => byId(state)[changeRequestId];
const getAudit = (state: ApplicationState, changeRequestId: string) => auditsByCRId(state)[changeRequestId];

const makeGetAudit = () => {
  return createSelector(
    getAudit,
    (audits: Audit[] = []) => audits.map((audit) => {
      switch (audit.field) {
        case "assessments.description":
        case "justifications.description":
        case "tasks.description":
        case "description":
          const html = audit.nextValue as string;
          audit.nextValue = striptags(html).substring(0, 100);
          return audit;
        default:
          return audit;
      }
    }),
  )
}

const getLoadAsyncState = (state: ApplicationState): AsyncState => state.changeRequests.loadAsyncInfo;
const getLoadListAsyncState = (state: ApplicationState): AsyncState => state.changeRequests.loadListAsyncInfo;
const getLoadApproversAsyncState = (state: ApplicationState): AsyncState => state.changeRequests.loadApproversAsyncInfo;
const getLoadAuditAsyncState = (state: ApplicationState): AsyncState => state.changeRequests.loadAuditAsyncInfo;

export default {
  byId,
  getChangeRequestsList,
  getChangeRequest,
  getLoadAsyncState,
  getLoadListAsyncState,
  getLoadApproversAsyncState,
  getApproversListForAssessmentForm,
  getLoadAuditAsyncState,
  getAudit,
  getAssignessList,
  makeGetAudit,
};
