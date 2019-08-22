import DOMPurify from "dompurify";

export const sanitizeHTML = (html: string) => ({ __html: DOMPurify.sanitize(html) })