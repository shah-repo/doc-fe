import { useObserver } from "mobx-react";
import React from "react";
import { FBMediaAlbumFieldProps, FBMediaAlbumFieldState } from ".";
import { FB } from "..";
import FBStore from "../stores/ui/FBStore";

export const withFBMediaAlbumField = <T extends FBMediaAlbumFieldProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    mediaAlbumFieldState,
    onClick,
    mode,
    name,
    qrValue,
    ...props
  }: T) => {
    mediaAlbumFieldState = FB.useRef<FBMediaAlbumFieldState>(
      FBMediaAlbumFieldState
    );

    // Handle mode
    onClick = () => {
      const mode =
        mediaAlbumFieldState?.getMode() === "qr" ? "mediaMode" : "qr";
      mediaAlbumFieldState?.setMode(mode);
    };

    useObserver(() => {
      mode = mediaAlbumFieldState?.mode;
    });

    qrValue = `https://enlil.io/fileupload?document=${FBStore.docId}&fieldname=${name}`;

    return Component({
      ...(props as T),
      mode,
      onClick,
      qrValue
    });
  };

  return (props: T) => Comp(props);
};
