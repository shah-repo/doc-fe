import { Box } from "@material-ui/core";
import React from "react";
import ReactQuill from "react-quill";
import {
  formats,
  modules,
} from "../../../components/forms/fields/TextEditor/configuration";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import { FBFormDefaultProps, FBOnChangeProps } from "../../types/common";

export type Props = FBFormDefaultProps & FBOnChangeProps;

const FBTextEditorField: React.FunctionComponent<Props> = ({
  labelRenderer,
  form,
  disabled,
  readOnly,
  ...props
}) => (
  <Box mb={4}>
    {labelRenderer}
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      onChange={props.onChange}
      value={props.value || ""}
      readOnly={disabled || readOnly}
      style={{ minHeight: 120 }}
      id={`field-${props.field.name}`}
    />
  </Box>
);

export default withLabelRenderer(withOnChange(FBTextEditorField));
