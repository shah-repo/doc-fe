import DOMPurify from "dompurify";
import { cloneDeep } from "lodash";
import striptags from "striptags";
import Config from "../../config";
import { ChangeRequest } from "../../state/ducks/changeRequest";
import { DocumentRevision } from "../../state/ducks/documentRevisions";

export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html);

export const getInnerHTMLProp = (html: string) => (
  { __html: sanitizeHtml(html) }
);

export const stripTags = (html: string) => striptags(html, [], "\n");

export const stripTagsFromObject = <T extends ChangeRequest | DocumentRevision>(item: T) => {
  const copy = cloneDeep(item);
  copy.description = stripTags(item.description);

  return copy;
};

export const theme = Config.Theme;
export const logo = "/logo_enlil_dark.svg";
