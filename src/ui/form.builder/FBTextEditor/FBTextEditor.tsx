import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBFieldName, FBInput, FBProvider, FBTextEditorProps } from "..";
import { FBFontStyle } from "../styles/FBFont.styles";
import FBTextEditorChild from "./FBTextEditor.child";
import { withFBTextEditor } from "./FBTextEditor.wrap";

const FBTextEditor: React.FunctionComponent<FBTextEditorProps> = ({
  textEditorState,
  disabled,
  name,
  ...props
}) => (
  <div id={`${FBFieldName.MPIProcedureId}-${name}`}>
    <FBProvider {...{ textEditorState }}>
      <FBInput {...props} {...{ name, disabled }} type="texteditor"
        labelProps={props.removeBorder ? FBFontStyle.labelMediumProps : FBFontStyle.labelProps}>
        <FBTextEditorChild {...props} {...{ name, disabled }} />
      </FBInput>
    </FBProvider>
  </div>
);

export default withFBTextEditor(FBTextEditor);
