import _ from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFilePresenter, FBFileUploadProps, FBFileUploadState } from "..";

export const withFBFileUpload = <T extends FBFileUploadProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fileUploadState,
    filePresenters,
    disabled,
    name,
    defaultValue,
    withState,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || defaultValue;
    fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState, formValue);


    useObserver(() => {
      filePresenters = _.map(fileUploadState?.files, (file) => (
        <FBFilePresenter key={`fb-file-presenter-${file.id}`} {...{ file, name, disabled }} />
      ));
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
      filePresenters,
      disabled,
      withState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
