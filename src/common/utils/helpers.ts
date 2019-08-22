import DOMPurify from "dompurify";
import striptags from "striptags";

export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html)

export const getInnerHTMLProp = (html: string) => (
  { __html: sanitizeHtml(html) }
);

export const stripTags = (html: string) => striptags(html, [], '\n');
