import React from "react";
import { FBEditorTitleProps } from "..";
import LeftToggleButtons from "../../../App/Enlil/Features/DocumentRevisionForm/Components/LeftPanel/Components/LeftToggleButtons";
import { withFBEditorTitle } from "./FBEditorTitle.wrap";

const FBEditorTitle: React.FunctionComponent<FBEditorTitleProps> = ({
  handleMode,
  mode,
}) =>
  (
    <LeftToggleButtons handleMode={handleMode} mode={mode}/>
  )
;

export default withFBEditorTitle(FBEditorTitle);
