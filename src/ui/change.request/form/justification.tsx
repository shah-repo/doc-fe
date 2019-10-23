import { Box } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import TextEditorField from "../../components/forms/fields/TextEditor";
import { withFormik } from "../../components/hoc/formik";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";

export type Props = Partial<FormikHybridFieldProps>;

export const Justification: React.FunctionComponent<Props> = ({ form }) => {
  const { attachments, description } = form!.values.justifications;
  const hasAttachment = (attachments || []).length > 0;

  const actionsRenderer = () => {
    if (!isEmpty(description)) { return; }
    return <AttachmentField name="justifications.attachments" />;
  };

  const renderTextEditor = !hasAttachment && (
    <TextEditorField
        name="justifications.description"
        label="cr.justification"
        actionsRenderer={actionsRenderer}
    />
  );

  const renderAttachments = hasAttachment && (
    <Box mt={3}>
      <HeaderField
        dataProp="cr.justification"
        actionsRenderer={actionsRenderer}
      />
      <AttachmentIconField name="justifications.attachments" />
    </Box>
  );

  return (
    <Box mb={8}>
      {renderTextEditor}
      {renderAttachments}
    </Box>
  );
};

export default withFormik<any, ChangeRequestFormValues>(Justification);
