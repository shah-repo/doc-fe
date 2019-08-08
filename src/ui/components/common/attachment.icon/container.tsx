import React from "react";
import { Attachment } from "../../../../state/ducks/attachments";
import { withFormik } from "../../hoc/formik";
import Presenter from "./presenter";
import { AttachmentIconContainerProps } from "./utils/types";

export const AttachmentIconContainer: React.FunctionComponent<AttachmentIconContainerProps> = ({
  name,
  form,
  field,
  ...other
}) => {

  const handleRemove = (attachment: Attachment) => () => {
    if (!form && !field) { return; }
    const filtered = (field!.value as Attachment[]).filter((a) => a.id !== attachment.id);
    form!.setFieldValue(name, filtered);
  };

  return <Presenter {...other} name={name} attachments={field!.value as Attachment[]} handleRemove={handleRemove} />;
};

export default withFormik(AttachmentIconContainer);
