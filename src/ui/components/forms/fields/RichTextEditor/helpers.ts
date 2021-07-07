import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

export const convertHtmlToDraft = (html = "") => {
  if (!html) {
    html = "";
  }
  html = html
    .replace(/b>/g, "strong>")
    .replace(/u>/g, "ins>");
  const contentBlock = htmlToDraft(html);
  if (!contentBlock) {
    return {} as EditorState;
  }
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  const editorState = EditorState.createWithContent(contentState);
  return editorState;
};
