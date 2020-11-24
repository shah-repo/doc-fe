import { findLastIndex, orderBy } from "lodash";
import moment from "moment";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";


export const shouldRedirectToLatestReleased = (
  documentRevisions: DocumentRevision[],
  documentRevisionId: string | null,
) => documentRevisions.length > 0 && !documentRevisionId;

export const getDocRevIdToRedirect = (
  documentRevisions: DocumentRevision[],
  deprecatedAt: string,
) => {
  if (deprecatedAt) {
    const depreactedAtDate = moment(deprecatedAt);
    const indexOfLastReleased = findLastIndex(documentRevisions, (doc) => {
      if (!doc.releasedAt) {
        return false;
      }

      return moment(doc.releasedAt).isSameOrBefore(depreactedAtDate);
    });
    const indexOfDocRev = indexOfLastReleased > -1 ? indexOfLastReleased : 0;

    return documentRevisions[indexOfDocRev].id;
  }

  const filteredList = documentRevisions.filter(({ releasedAt }) => releasedAt);

  if (filteredList.length === 0) {
    return documentRevisions[0].id;
  }

  const sortedList = orderBy(
    filteredList,
    [({ releasedAt }) => releasedAt ? new Date(releasedAt) : new Date()],
    "desc",
  );

  return sortedList[0].id;
};
