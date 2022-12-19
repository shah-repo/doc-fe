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
    onClick,
    onChange,
    fileFieldState,
    name = "",
    ...props
  }: T) => {
    const { fileUploadState, workspaceState, formState, dialogState  } = FB.useStores();
    const { id } = workspaceState || {};
    fileFieldState = FB.useRef<FBFileFieldState>(FBFileFieldState);

    const fileUploadEl = document.getElementById(`fb-attachment-field-${name}`);

    if (fileUploadEl) {
      fileUploadEl.onclick = registerCancel;
    }

    function registerCancel() {
      document.body.onfocus = removeLock;
    }

    function removeLock() {
      if (fileUploadEl?.nodeValue?.length) { return; }
      setTimeout(() => {
        formState?.unlockField(name);
      }, 1000);
    }

    function handleLockField() {
      if (formState?.isBackdropOpen) { return; }
      if (!id) { return; }
      if (!name) { return; }
      formState?.lockField({
        fields: [{
          formInput: [{
            [name]: true,
          }],
        }],
        documentRevisionId: id,
      }, name);
    }

    onUploadClick = () => {
      handleLockField();
    };

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
      if (!dialogState?.open) {
        fileFieldState?.upload(validFiles);
      }
    };

    onClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      const element = event.target as HTMLInputElement;
      element.value = "";
    };

    React.useEffect(() => {
      reaction(
        () => fileFieldState?.data,
        (data) => {
          if (!dialogState?.open) {
            fileUploadState?.addFile(data);
          }
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return useObserver(() => Component({
      ...(props as T),
      onUploadClick,
      onClick,
      onChange,
      formState,
      loading: fileFieldState?.loading,
      name,
    }));
  };

  return (props: T) => Comp(props);
};
