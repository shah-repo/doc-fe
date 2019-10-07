import { TextEditorOwnProps } from "../../components/forms/fields/TextEditor";
import { FBLabelRendererProps } from "./common";

export interface EditorFieldProps extends TextEditorOwnProps {
  label?: string;
}

export type FBTextEditorFieldProps = EditorFieldProps & FBLabelRendererProps;
