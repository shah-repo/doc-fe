import { RefObject } from "react";
import ReactQuill from "react-quill";
import { DialogHandler } from "../../hooks/useDialog";
import { Async } from "../../hooks/useAsync";

export interface DialogContainerProps {
  auditId: string;
  dialogHandler: DialogHandler;
}

export interface DialogPresenterProps {
  oldText: string;
  newText: string;
  loadChanges(): void;
  dialogHandler: DialogHandler;
  async: Async;
}

export interface DiffContainerProps {
  oldText: string;
  newText: string;
}

export interface DiffPresenterProps {
  oldText: string;
  newText: string;
  refOld: RefObject<ReactQuill>;
  refNew: RefObject<ReactQuill>;
  delta: any;
}

export interface DialogOpenerProps {
  id: string;
  text: string;
}