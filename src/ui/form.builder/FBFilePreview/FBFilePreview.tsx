import React from "react";
import PrismaZoom from "react-prismazoom";
import { FBFilePreviewProps } from "..";
import Text from "../../components/Text";
import { withFBFilePreview } from "./FBFilePreview.wrap";

const FBFilePreview: React.FunctionComponent<FBFilePreviewProps> = ({
  file: { url },
  previewType,
}) => (
  <>
    {previewType === "video" && (
      <video controls={true} width="100%" height="95%" src={url}>
        <Text translation="file.viewer.video.not.supported" />
      </video>
    )}
    {previewType === "pdf" && (
      <object width="100%" height="100%" type="application/pdf" data={url}>
        <Text translation="common.file.not.loaded" />
      </object>
    )}
    {previewType === "image" && (
      <PrismaZoom
        topBoundary={180}
        style={{
          maxWidth: "50vw",
          width: "100%",
          maxHeight: "95vh",
          margin: "0 auto",
        }}>
        <img src={url} alt={url} width="100%" />
      </PrismaZoom>
    )}
  </>
);

export default withFBFilePreview(FBFilePreview);
