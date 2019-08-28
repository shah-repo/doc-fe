import DOMPurify from "dompurify";
import striptags from "striptags";
import _ from "lodash";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import { ChangeRequest } from "../../state/ducks/changeRequest";

export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html)

export const getInnerHTMLProp = (html: string) => (
  { __html: sanitizeHtml(html) }
);

export const stripTags = (html: string) => striptags(html, [], '\n');

export const stripTagsFromObject = (item: ChangeRequest | DocumentRevision) => {
  const copy = _.cloneDeep(item);
  copy.description = stripTags(item.description);

  return copy;
}