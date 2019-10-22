import { Box } from "@material-ui/core";
import React from "react";
import { Attachment } from "../../../state/ducks/attachments";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import TextEditorField from "../../components/forms/fields/TextEditor";
import { withFormik } from "../../components/hoc/formik";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";

export const Justification: React.FunctionComponent<FormikHybridFieldProps> = ({
  field: { value },
}) => {

  const { attachments }: {attachments: Attachment[]} = value.justifications;

  const actionsRenderer = () => (
    <AttachmentField name="justifications.attachments" />
  );

  return (
    <Box mb={8}>
      <TextEditorField
        name="justifications.description"
        label="cr.justification"
        actionsRenderer={actionsRenderer}
        hidden={attachments.length > 0}
      />
      <Box mt={-5}>
        <AttachmentIconField name="justifications.attachments" />
      </Box>
    </Box>
  );
};

export default withFormik(Justification);
