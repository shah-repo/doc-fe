import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFileUploadProps, FBFileUploadState } from "..";

export const withFBFileUpload = <T extends FBFileUploadProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fileUploadState,
    disabled,
    name,
    defaultValue,
    withState,
    files,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || defaultValue;
    fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState, formValue);

    useObserver(() => {
      files = fileUploadState?.files;
    });

    React.useEffect(() => {
      reaction(
        () => fileUploadState?.files,
        (files) => {
          formState?.setFieldValue(name, files, withState);
          formState?.setFieldAutosave(name);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      fileUploadState,
      files,
      disabled,
      withState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
