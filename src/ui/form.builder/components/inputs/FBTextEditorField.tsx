import { Box } from "@material-ui/core";
import React from "react";
import ComponentProps from "react-quill";
import ReactQuill from "react-quill";
import { formats, modules } from "../../../components/forms/fields/TextEditor/configuration";
import { FormikHybridFieldProps } from "../../../components/hoc/utils/types";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import { formBuilderStore } from "../../stores/FBStore";
import { FBFormDefaultProps, FBOnChangeProps } from "../../types/common";

type Props = FBFormDefaultProps & FBOnChangeProps & FormikHybridFieldProps;

const FBTextEditorField: React.FunctionComponent<Props> = ({
  labelRenderer,
  form,
  ...props
}) => {
  const handleChange = (editHtml: string) => {
    form.setFieldValue(props.name!, editHtml);
    formBuilderStore.values = form.values;
  };

  return (
    <Box mb={4}>
      {labelRenderer}
      <ReactQuill
        theme="snow"
        bounds=".editor-container"
        modules={modules}
        formats={formats}
        onChange={handleChange}
        value={props.value || ""}
      />
    </Box>
  );
};

export default withLabelRenderer(withOnChange(FBTextEditorField));
