import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBMediaAlbumFieldProps, FBMediaAlbumFieldState, FBMediaFile } from "..";
import FBStore from "../stores/ui/FBStore";

export const withFBMediaAlbumField = <T extends FBMediaAlbumFieldProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    mediaAlbumFieldState,
    setMediaFieldMode,
    onFileUploadChange,
    isTemplate = false,
    actionsDisabled,
    loading,
    collection,
    removeMedia,
    name = "",
    qrValue,
    mode,
    ...props
  }: T) => {
    const documentId = FBStore.documentId;
    const { workspaceState } = FB.useStores();
    mediaAlbumFieldState = FB.useRef<FBMediaAlbumFieldState>(
      FBMediaAlbumFieldState, { name, isTemplate, workspaceState }
    );
    qrValue = `https://enlil.io/fileupload?document=${documentId}&fieldname=${name}`;

    // Handle mode
    setMediaFieldMode = () => {
      const mode = mediaAlbumFieldState?.mode === "qr" ? "media" : "qr";
      mediaAlbumFieldState?.setMode(mode);
    };

    // Handle image upload
    onFileUploadChange = (event: React.FormEvent<HTMLInputElement>) => {
      const files = _.get(event, "currentTarget.files", []);
      _.map(files, (file, index) => {
        (file as FBMediaFile).order = (_.last(collection)?.order || 0) + _.toNumber(index + 1);
      });
      mediaAlbumFieldState?.upload(files as FBMediaFile[]);
    };

    useObserver(() => {
      mode = mediaAlbumFieldState?.mode;
      loading = mediaAlbumFieldState?.loading;
      collection = mediaAlbumFieldState?.collection;
    });

    return Component({
      ...(props as T),
      removeMedia: mediaAlbumFieldState?.removeCandidate,
      actionsDisabled: mediaAlbumFieldState?.isPreview,
      mediaAlbumFieldState,
      onFileUploadChange,
      setMediaFieldMode,
      collection,
      isTemplate,
      qrValue,
      loading,
      mode,
      name,
    });
  };

  return (props: T) => Comp(props);
};
