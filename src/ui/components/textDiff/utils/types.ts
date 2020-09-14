// eslint-disable-next-line: no-implicit-dependencies
import { DeltaStatic } from "quill";
import { RefObject } from "react";
import ReactQuill from "react-quill";
import { Async } from "../../../hooks/useAsync";
import { DialogHandler } from "../../../hooks/useDialog";

export interface DialogContainerProps {
  auditId: string;
  dialogHandler: DialogHandler;
}

export interface DialogPresenterProps {
  oldText: string;
  newText: string;
  dialogHandler: DialogHandler;
  async: Async;
  loadChanges(): void;
}

export interface DiffContainerProps {
  oldText: string;
  newText: string;
}

export interface DiffPresenterProps {
  refOld: RefObject<ReactQuill>;
  refNew: RefObject<ReactQuill>;
  refMain: RefObject<ReactQuill>;
  delta: DeltaStatic | null;
}

export interface DialogOpenerProps {
  id: string;
  text: string;
  dataCy?: string;
}
