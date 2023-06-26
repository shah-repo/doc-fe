import { DocumentRevisionFooterState, DocumentRevisionFormState, DocumentRevisionSidebarState, SMFormState, SMTabsState, SMTextEditorState } from '../../..';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SMProviderProps {
  _formState?: SMFormState
  _documentRevisionFooterState?: DocumentRevisionFooterState
  _documentRevisionSidebarState?: DocumentRevisionSidebarState
  _documentRevisionFormState?: DocumentRevisionFormState
  _tabsState?: SMTabsState
  _textEditorState?: SMTextEditorState
}
