import DOMPurify from "dompurify";

export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html)

export const getInnerHTMLProp = (html: string) => (
  { __html: sanitizeHtml(html) }
);
