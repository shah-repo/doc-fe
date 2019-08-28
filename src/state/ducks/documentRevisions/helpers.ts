import _ from "lodash";
import { DocumentRevision } from "./types";
import { stripTags } from "../../../common/utils/helpers";

export const stripTagsFromDocRev = (docRev: DocumentRevision) => {
  const copy = _.cloneDeep(docRev);
  copy.description = stripTags(docRev.description);

  return copy;
}