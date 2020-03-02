import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBMediaAlbumProps, FBMediaAlbumState } from ".";
import { FB } from "..";

export const withFBMediaAlbum = <T extends FBMediaAlbumProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    mediaAlbumState,
    collection = [],
    title = "",
    onClick,
    mode,
    ...props
  }: T) => {
    mediaAlbumState = FB.useRef<FBMediaAlbumState>(FBMediaAlbumState);

    // Handle mode
    onClick = () => {
      const mode =
        mediaAlbumState?.getMode() === "carousel" ? "gallery" : "carousel";
      mediaAlbumState?.setMode(mode);
    };

    // Temp static data
    collection = [
      {
        id: "1",
        label: "San Francisco – Oakland Bay Bridge, United States",
        path:
          "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60"
      },
      {
        id: "2",
        label: "Bird",
        path:
          "https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60"
      },
      {
        id: "3",
        label: "Bali, Indonesia",
        path:
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80"
      },
      {
        id: "4",
        label: "NeONBRAND Digital Marketing, Las Vegas, United States",
        path:
          "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60"
      },
      {
        id: "5",
        label: "Goč, Serbia",
        path:
          "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60"
      }
    ];

    useObserver(() => {
      if (!_.isUndefined(mediaAlbumState?.activeMedia)) {
        title = _.get(collection[mediaAlbumState!.activeMedia!], "label", "");
      }
      mode = mediaAlbumState?.mode;
    });

    return Component({
      ...(props as T),
      mediaAlbumState,
      collection,
      title,
      mode,
      onClick
    });
  };

  return (props: T) => Comp(props);
};
