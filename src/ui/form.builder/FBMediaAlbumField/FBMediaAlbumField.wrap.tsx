import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBMediaAlbumFieldProps, FBMediaAlbumFieldState } from ".";
import { FB } from "..";
import FBDRStore from "../stores/ui/FBDRStore";
import FBStore from "../stores/ui/FBStore";

export const withFBMediaAlbumField = <T extends FBMediaAlbumFieldProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    mediaAlbumFieldState,
    onClick,
    onFileUploadChange,
    mode,
    name = "",
    qrValue,
    collection,
    loading = false,
    qrMode = "qr",
    isTemplate,
    removeMedia,
    ...props
  }: T) => {
    mediaAlbumFieldState = FB.useRef<FBMediaAlbumFieldState>(FBMediaAlbumFieldState);
    const documentId = FBStore.documentId;

    React.useEffect(() => {
      const isPreview =
        (FBStore.mode !== "design" && isTemplate) ||
        (FBStore.mode === "preview" && FBDRStore.isOutput && !isTemplate);
      isPreview && mediaAlbumFieldState && (mediaAlbumFieldState.setMode("preview"));
      if (!_.isEmpty(documentId)) {
        mediaAlbumFieldState?.setFieldName(name);
        mediaAlbumFieldState?.downloadCandidates();
      }
    }, [documentId, isTemplate, mediaAlbumFieldState, name]);

    // Handle mode
    onClick = () => {
      const mode =
        mediaAlbumFieldState?.getMode() === "qr" ? "mediaMode" : "qr";
      mediaAlbumFieldState?.setMode(mode);
    };

    // Handle image upload
    onFileUploadChange = (event: React.FormEvent<HTMLInputElement>) => {
      const files = _.get(event, "currentTarget.files", []);
      mediaAlbumFieldState?.upload(files as File[]);
    };

    useObserver(() => {
      mode = mediaAlbumFieldState?.mode;
      collection = mediaAlbumFieldState?.collection;
      loading = mediaAlbumFieldState?.loading || false;
    });

    qrValue = `https://enlil.io/fileupload?document=${FBStore.documentId}&fieldname=${name}`;

    return Component({
      ...(props as T),
      mediaAlbumFieldState,
      mode,
      onClick,
      qrValue,
      onFileUploadChange,
      collection,
      name,
      loading,
      isTemplate,
      removeMedia: mediaAlbumFieldState?.removeCandidate,
    });
  };

  return (props: T) => Comp(props);
};
