import React from "react";
import { Attachment } from "../../../../state/ducks/attachments";
import Presenter from "./presenter";
import { AttachmentIconContainerProps } from "./utils/types";

export const AttachmentIconContainer: React.FunctionComponent<AttachmentIconContainerProps> = ({
  name,
  form,
  field: { value },
  ...other
}) => {

  const handleRemove = (attachment: Attachment) => () => {
    const filtered = (value as Attachment[]).filter((a) => a.id !== attachment.id);
    form.setFieldValue(name, filtered);
  };

  return <Presenter {...other} name={name} attachments={value as Attachment[]} handleRemove={handleRemove} />;
};

export default AttachmentIconContainer;
