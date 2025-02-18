import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import { PDF, SUPPORTED_IMAGE_FILES } from '../../../../../../../../ui/components/common/view.file/utils/constants';
import { FB, FBFilePresenterDownloadType, FBFilePresenterState } from '../../../../../../../../ui/form.builder';
import { OCRFilePresenterProps } from './types';

export const withOCRFilePresenter = (
  Component: React.FC<OCRFilePresenterProps>,
) => {
  const Comp = ({
    handleDownload,
    loadFile,
    filePresenterState,
    file,
    setFile,
    isLoading,
    isSupportedFileType,
    ...props
  }: OCRFilePresenterProps) => {
    filePresenterState = FB.useRef<FBFilePresenterState>(FBFilePresenterState, file);
    isSupportedFileType = [...SUPPORTED_IMAGE_FILES, PDF].includes(file.type);

    useObserver(() => {
      isLoading = filePresenterState?.loading;
    });

    React.useEffect(() => {
      return reaction(
        () => filePresenterState?.data,
        (data) => {
          if (!data?.url) { return; }
          file.url = filePresenterState?.data?.url;
          handleLoaded();
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleLoaded () {
      switch (filePresenterState?.downloadType) {
        case 'view':
          setFile?.(file);
          break;
        default:
          window.onbeforeunload = null;
          window.open(file.url);
      }
    }

    handleDownload = (type: FBFilePresenterDownloadType = 'download') => {
      filePresenterState?.setDownloadType(type);
      if (!file.url) { return; }
      handleLoaded();
    };

    loadFile = () => {
      if (!isSupportedFileType) {
        return;
      }

      if (filePresenterState?.isFileViewable) {
        return handleDownload?.('view');
      }
      handleDownload?.('download');
    };

    useEffect(() => {
      loadFile?.();
    }, []);

    return Component({
      ...(props),
      filePresenterState,
      handleDownload,
      loadFile,
      file,
      isLoading,
      isSupportedFileType,
    });
  };

  return (props) => Comp(props);
};
