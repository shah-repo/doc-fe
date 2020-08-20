import _ from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FBFileFieldProps, FBFileFieldState } from ".";
import { FB } from "..";

export const withFBAttachmentField = <T extends FBFileFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fileFieldState,
    onChange,
    name = "",
    ...props
  }: T) => {
    const { fileUploadState } = FB.useStores();
    fileFieldState = FB.useRef<FBFileFieldState>(FBFileFieldState);

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

    React.useEffect(() => {
      reaction(
        () => fileFieldState?.data,
        (data) => fileUploadState?.addFile(data)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return useObserver(() => Component({
      ...(props as T),
      onChange,
      loading: fileFieldState?.loading,
      name,
    }));
  };

  return (props: T) => Comp(props);
};
