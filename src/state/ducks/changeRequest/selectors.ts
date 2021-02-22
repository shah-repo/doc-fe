
import { createSelector } from "reselect";
import { stripTags, stripTagsFromObject } from "../../../common/utils/helpers";
import { OptionType } from "../../../ui/components/forms/fields/Autocomplete/types";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";
import { Audit, AuditGroupType } from "../audit";

const allIds = (state: ApplicationState) => state.changeRequests.allIds;
const byId = (state: ApplicationState) => state.changeRequests.byId;
const approversById = (state: ApplicationState) => state.changeRequests.approversById;
const approversAllIds = (state: ApplicationState) => state.changeRequests.approversAllIds;
const auditsByCRId = (state: ApplicationState) => state.changeRequests.auditsByCRId;

const getChangeRequestsList = createSelector(
  allIds, byId,
  (ids, changeRequests) =>
    ids.map((id) => stripTagsFromObject(changeRequests[id])),
);

const getApproversListForAssessmentForm = createSelector(
  approversAllIds, approversById,
  (ids, approvers): OptionType[] =>
    ids.map((id) => ({ value: approvers[id].id, label: approvers[id].user.name })),
);

const getApproversListWithoutCurrentUser = createSelector(
  (state: ApplicationState) => ({
    ids: approversAllIds(state),
    approvers: approversById(state),
  }),
  (state, owner) => owner,
  ({ ids, approvers }, currentUserId): OptionType[] => {
    const list: OptionType[] = [];

    ids.forEach((id) => {
      if (id === currentUserId) {
        return;
      }

      list.push(
        {
          value: approvers[id].id,
          label: approvers[id].user.name,
        },
      );
    });
    return list;
  },
);

const getAssignessList = createSelector(
  approversAllIds, approversById,
  (ids, approvers): OptionType[] =>
    ids.map((id) => ({ value: approvers[id].id, label: approvers[id].user.name })),
);

const getChangeRequest = (state: ApplicationState, changeRequestId: string) => byId(state)[changeRequestId];
const getAudit = (state: ApplicationState, changeRequestId: string) => auditsByCRId(state)[changeRequestId];

const makeGetAudit = () => createSelector(
  getAudit,
  (audits: AuditGroupType = {}) =>  {
    Object.keys(audits).forEach((groupId) => {
      audits[groupId].map((audit: Audit) => {
        switch (audit.field) {
          case "assessments.description":
          case "justifications.description":
          case "tasks.description":
          case "description":
          case "assessments.process.reasoning":
          case "assessments.design.reasoning":
          case "assessments.regulatory.reasoning": {
            const html = audit.nextValue as string;
            audit.nextValue = stripTags(html).substring(0, 100);
            return audit;
          }
          default:
            return audit;
        }
      });
    });
    return audits;
  },
);

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
  getApproversListWithoutCurrentUser,
  getLoadAuditAsyncState,
  getAudit,
  getAssignessList,
  makeGetAudit,
};
