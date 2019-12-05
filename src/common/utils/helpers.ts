import DOMPurify from "dompurify";
import _ from "lodash";
import striptags from "striptags";
import { ChangeRequest } from "../../state/ducks/changeRequest";
import { DocumentRevision } from "../../state/ducks/documentRevisions";

export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html);

export const getInnerHTMLProp = (html: string) => (
  { __html: sanitizeHtml(html) }
);

export const stripTags = (html: string) => striptags(html, [], "\n");

export const stripTagsFromObject = <T extends ChangeRequest | DocumentRevision>(item: T) => {
  const copy = _.cloneDeep(item);
  copy.description = stripTags(item.description);

  return copy;
};


