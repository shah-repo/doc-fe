import { get, last, map, toNumber } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBMediaAlbumFieldProps, FBMediaAlbumFieldState, FBMediaFile } from "..";

export const withFBMediaAlbumField = <T extends FBMediaAlbumFieldProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    mediaAlbumFieldState,
    setMediaFieldMode,
    onFileUploadChange,
    isTemplate = false,
    actionsDisabled,
    reviseDisabled,
    loading,
    collection,
    removeMedia,
    name = "",
    qrValue,
    mode,
    ...props
  }: T) => {
    const { workspaceState } = FB.useStores();
    mediaAlbumFieldState = FB.useRef<FBMediaAlbumFieldState>(
      FBMediaAlbumFieldState, { name, isTemplate, workspaceState }
    );
    qrValue = `https://enlil.io/fileupload?document=${mediaAlbumFieldState.documentId}&fieldname=${name}`;

    // Handle mode
    setMediaFieldMode = () => {
      const mode = mediaAlbumFieldState?.mode === "qr" ? "media" : "qr";
      mediaAlbumFieldState?.setMode(mode);
    };

    // Handle image upload
    onFileUploadChange = (event: React.FormEvent<HTMLInputElement>) => {
      const files = get(event, "currentTarget.files", []);
      map(files, (file, index) => {
        (file as FBMediaFile).order = (last(collection)?.order || 0) + toNumber(index + 1);
      });
      mediaAlbumFieldState?.upload(files as FBMediaFile[]);
    };

    useObserver(() => {
      mode = mediaAlbumFieldState?.mode;
      loading = mediaAlbumFieldState?.loading;
      collection = mediaAlbumFieldState?.collection;
    });

    actionsDisabled = (reviseDisabled && workspaceState?.isRevised) || mediaAlbumFieldState?.isPreview;

    return Component({
      ...(props as T),
      removeMedia: mediaAlbumFieldState?.removeCandidate,
      actionsDisabled,
      mediaAlbumFieldState,
      onFileUploadChange,
      setMediaFieldMode,
      reviseDisabled,
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
