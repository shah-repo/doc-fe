import { filter, get, isEmpty, join } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFileFieldProps, FBFileFieldState } from "..";
import { toastError } from "../../components/notifications";

export const withFBAttachmentField = <T extends FBFileFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onUploadClick,
    onChange,
    fileFieldState,
    name = "",
    ...props
  }: T) => {
    const { fileUploadState, workspaceState, formState } = FB.useStores();
    const { id } = workspaceState || {};
    fileFieldState = FB.useRef<FBFileFieldState>(FBFileFieldState);

    function handleLockField() {
      if (!id) { return; }
      if (!name) { return; }
      formState?.lockFields({
        fields: [{
          formInput: [{
            [name]: true,
          }],
        }],
        documentRevisionId: id,
      }, name);
    }

    onUploadClick = () => handleLockField();

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const eventFiles = get(event, "currentTarget.files", []);
      const invalidFiles: string[] = [];

      const validFiles: File[] = filter(eventFiles, (file) => {
        const fileName = get(file, "name", "");
        const type = fileName.split(".").pop();
        (type === "doc") && (invalidFiles.push(fileName));
        return type !== "doc";
      });

      if (!isEmpty(invalidFiles)) {
        toastError(`.doc files are not accepted. Please use .docx. Invalid documents: ${join(invalidFiles, ", ")}`);
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
      onUploadClick,
      onChange,
      loading: fileFieldState?.loading,
      name,
    }));
  };

  return (props: T) => Comp(props);
};
