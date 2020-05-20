import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBFileFieldProps, FBFileFieldState } from ".";
import { FB } from "..";
import { Attachment } from "../../../state/ducks/attachments";

export const withFBAttachmentField = <T extends FBFileFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fileFieldState,
    onChange,
    name = "",
    ...props
  }: T) => {
    const { fileUploadState, formState } = FB.useStores();
    fileFieldState = FB.useRef<FBFileFieldState>(FBFileFieldState);

    React.useEffect(() => {
      if (_.isUndefined(formState)) {
        return;
      }
      const formValue: Attachment[] | undefined = formState.getFieldValue(name, undefined);
      fileUploadState?.addFiles(formValue);
    }, []);

    useObserver(() => {
      if (!_.get(formState?.values, name)) {
        formState?.setFieldValue(name, fileUploadState?.files);
      }
      fileUploadState?.addFile(fileFieldState?.data);
    });

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const eventFiles = _.get(event, "currentTarget.files", []);
      const invalidFiles: string[] = [];

      const validFiles: File[] = _.filter(eventFiles, (file) => {
        const fileName = _.get(file, "name", "");
        const type = fileName.split(".").pop();
        (type === "doc") && (invalidFiles.push(fileName));
        return type !== "doc";
      });

      if (!_.isEmpty(invalidFiles)) {
        alert(`.doc files are not accepted. Please use .docx. Invalid documents: ${_.join(invalidFiles, ", ")}`);
      }

      fileFieldState?.upload(validFiles);
    };

    return useObserver(() => Component({
      ...(props as T),
      onChange,
      loading: fileFieldState?.loading,
      name,
    }));
  };

  return (props: T) => Comp(props);
};
