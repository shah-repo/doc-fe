import React from "react";
import { FBFormMarkDownProps } from "..";
import FBButton from "../components/inputs/FBButton";
import { withFBFormMarkDown } from "./FBFormMarkDown.wrap";

const FBFormMarkDown: React.FunctionComponent<FBFormMarkDownProps> = ({
  exportMarkdown,
}) => <FBButton label="Source" onClick={exportMarkdown} />;

export default withFBFormMarkDown(FBFormMarkDown);
