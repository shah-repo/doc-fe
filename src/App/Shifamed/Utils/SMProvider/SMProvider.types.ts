import { DocumentRevisionFooterState, DocumentRevisionFormState, DocumentRevisionLeftPanelState, DocumentRevisionSidebarState, SMFormState, SMTabsState, SMTextEditorState } from "../../..";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SMProviderProps {
  _formState?: SMFormState;
  _documentRevisionFooterState?: DocumentRevisionFooterState;
  _documentRevisionSidebarState?: DocumentRevisionSidebarState;
  _documentRevisionLeftPanelState?: DocumentRevisionLeftPanelState;
  _documentRevisionFormState?: DocumentRevisionFormState;
  _tabsState?: SMTabsState;
  _textEditorState?: SMTextEditorState;
}
