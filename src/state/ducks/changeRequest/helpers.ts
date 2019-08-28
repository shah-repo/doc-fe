import _ from "lodash";
import { ChangeRequest } from "./types";
import { stripTags } from "../../../common/utils/helpers";

export const stripTagsFromChangeRequest = (cr: ChangeRequest) => {
  const copy = _.cloneDeep(cr);
  copy.description = stripTags(cr.description);

  return copy;
}