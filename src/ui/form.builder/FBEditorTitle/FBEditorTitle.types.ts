import { FBEditorProps } from "..";

export type FBEditorTitleProps =
& Pick<FBEditorProps, "mode">
& {
  handleMode?: () => any;
};
