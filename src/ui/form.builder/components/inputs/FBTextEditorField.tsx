import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import { FieldProps } from "formik";
import React from "react";
import ReactQuill from "react-quill";
import Field from "../../../components/forms/fields/Field";
import { formats, modules } from "../../../components/forms/fields/TextEditor/configuration";
import { FormikHybridFieldProps } from "../../../components/hoc/utils/types";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import { FBFormDefaultProps, FBOnChangeProps } from "../../types/common";

type Props =
  & FBFormDefaultProps
  & FBOnChangeProps
  & FormikHybridFieldProps
  & FieldProps;

const FBTextEditorField: React.FunctionComponent<Props> = ({
  labelRenderer,
  form,
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
      readOnly={props.disabled}
      id={`field-${props.field.name}`}
    />
  </Box>
);

export default withLabelRenderer(withOnChange(FBTextEditorField));
