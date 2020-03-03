import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBMediaAlbumFieldProps, FBMediaAlbumFieldState, FBMediaAlbumFieldUpload } from ".";
import { FB } from "..";
import FBStore from "../stores/ui/FBStore";

export const withFBMediaAlbumField = <T extends FBMediaAlbumFieldProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    mediaAlbumFieldState,
    mediaAlbumFieldUpload,
    onClick,
    onFileUploadChange,
    mode,
    name = "",
    qrValue,
    collection,
    ...props
  }: T) => {
    mediaAlbumFieldState = FB.useRef<FBMediaAlbumFieldState>(
      FBMediaAlbumFieldState
    );

    mediaAlbumFieldUpload = FB.useRef<FBMediaAlbumFieldUpload>(
      FBMediaAlbumFieldUpload
    );

    const documentId = FBStore.documentId;

    React.useEffect(() => {
      if (!_.isEmpty(documentId)) {
        mediaAlbumFieldUpload?.setFieldName(name);
        mediaAlbumFieldUpload?.downloadCandidates();
      }
    }, [documentId, mediaAlbumFieldState, name]);

    // Handle mode
    onClick = () => {
      const mode =
        mediaAlbumFieldState?.getMode() === "qr" ? "mediaMode" : "qr";
      mediaAlbumFieldState?.setMode(mode);
    };

    // Handle image upload
    onFileUploadChange = (event: React.FormEvent<HTMLInputElement>) => {
      const files = (event.currentTarget.files as unknown) as
        | File[]
        | undefined;
      mediaAlbumFieldUpload?.setFiles(files);
    };

    useObserver(() => {
      mode = mediaAlbumFieldState?.mode;
      collection = mediaAlbumFieldUpload?.collection;
    });

    qrValue = `https://enlil.io/fileupload?document=${FBStore.docId}&fieldname=${name}`;

    return Component({
      ...(props as T),
      mode,
      onClick,
      qrValue,
      onFileUploadChange,
      collection,
      mediaAlbumFieldUpload,
    });
  };

  return (props: T) => Comp(props);
};
