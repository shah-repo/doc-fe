import { isEmpty } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBMediaAlbumProps, FBMediaAlbumState } from "..";

export const withFBMediaAlbum = <T extends FBMediaAlbumProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    onClick,
    setMediaMode,
    mediaAlbumState,
    collection = [],
    hiddenContainer,
    actionsDisabled,
    title = "",
    mode,
    name,
    uploadDisabled,
    ...props
  }: T) => {

    mediaAlbumState = FB.useRef<FBMediaAlbumState>(FBMediaAlbumState);
    const { formState, workspaceState } = FB.useStores();
    const { mode: workspaceMode, id } = workspaceState || {};

    // Handle mode
    setMediaMode = () => {
      const mode = mediaAlbumState?.mode === "carousel" ? "gallery" : "carousel";
      mediaAlbumState?.setMode(mode);
    };

    useObserver(() => {
      mode = mediaAlbumState?.mode;
      uploadDisabled = formState?.locked.get(name || "")?.locked;
      title = (mode === "carousel")
        ? collection[mediaAlbumState?.activeMedia || 0]?.name
        : "";
      hiddenContainer = Boolean(
        (workspaceMode === "preview" || workspaceMode === "formPreview" || actionsDisabled) &&
        isEmpty(collection)
      );
    });

    onClick = () => {
      if (!name) { return; }
      if (!id) { return; }
      formState?.lockFields({
        fields: [{
          formInput: [{
            [name]: true,
          }],
        }],
        documentRevisionId: id,
      }, name);
    };

    const fileUploadEl = document.getElementById(`fb-mediaalbum-upload-${name}`);

    if (fileUploadEl) {
      fileUploadEl.onclick = registerCancel;
    }


    function registerCancel() {
      document.body.onfocus = removeLock;
    }

    function removeLock() {
      if (fileUploadEl?.nodeValue?.length) { return; }
      const lockData = formState?.locked.get(name || "");
      formState?.locked.set(name || "", {
        ...lockData,
        lockId: undefined,
      });
      formState?.expireLockedFields(lockData?.lockId);
    }

    return Component({
      ...(props as T),
      onClick,
      setMediaMode,
      mediaAlbumState,
      workspaceMode,
      hiddenContainer,
      actionsDisabled,
      collection,
      title,
      mode,
      name,
      uploadDisabled,
    });
  };

  return (props: T) => Comp(props);
};
