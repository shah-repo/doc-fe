import { CircularProgress, IconButton } from "@material-ui/core";
import { CloudDownload } from "@material-ui/icons";
import React from "react";

export interface DownloadButtonPresenterProps {
  isLoading: boolean;
  onClick: () => void;
}

const DownloadButtonPresenter: React.FunctionComponent<DownloadButtonPresenterProps> = ({ isLoading, onClick }) => (
  <IconButton id="download" aria-label="Download" disabled={isLoading} onClick={onClick}>
    {!isLoading ? <CloudDownload fontSize="small" /> : <CircularProgress size={20} />}
  </IconButton>
);

export default DownloadButtonPresenter;
