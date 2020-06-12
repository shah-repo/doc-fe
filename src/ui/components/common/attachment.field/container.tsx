import { Box } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import {  attachmentsActions } from "../../../../state/ducks/attachments";
import { ApplicationState } from "../../../../state/reducers";
import { withFormik } from "../../hoc/formik";
import Presenter from "./presenter";
import { AttachmentContainerProps, AttachmentFieldDispatchProps } from "./utils/types";

type DispatchProps = AttachmentFieldDispatchProps;

export const AttachmentFieldContainer: React.FunctionComponent<AttachmentContainerProps> = ({
  name = "",
  upload,
  component = "button",
  multiple = true,
  field,
  form,
  ...other
}) => (
  <Box>
    <Presenter
      upload = {upload}
      {...other}
      name={name}
      component={component}
      multiple={multiple}
      form={form}
      field={field}
    />
  </Box>
);

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  upload: attachmentsActions.upload,
})(withFormik(AttachmentFieldContainer));
