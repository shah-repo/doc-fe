import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import { PDF, SUPPORTED_IMAGE_FILES } from '../../../../../../../ui/components/common/view.file/utils/constants';
import { FB, FBFilePresenterDownloadType, FBFilePresenterState } from '../../../../../../../ui/form.builder';
import { OCRFilePresenterProps } from './OCRFilePresenter';

export const withOCRFilePresenter = (
  Component: React.FunctionComponent<OCRFilePresenterProps>,
) => {
  const Comp = ({
    handleDownload,
    loadFIle,
    filePresenterState,
    file,
    setFile,
    loading,
    isSupportedFileType,
    ...props
  }: OCRFilePresenterProps) => {
    filePresenterState = FB.useRef<FBFilePresenterState>(FBFilePresenterState, file);
    isSupportedFileType = [...SUPPORTED_IMAGE_FILES, PDF].includes(file.type);

    useObserver(() => {
      loading = filePresenterState?.loading;
    });

    React.useEffect(() => {
      reaction(
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

    loadFIle = () => {
      if (!isSupportedFileType) {
        return;
      }

      if (filePresenterState?.isFileViewable) {
        return handleDownload?.('view');
      }
      handleDownload?.('download');
    };

    useEffect(() => {
      loadFIle?.();
    }, []);

    return Component({
      ...(props),
      filePresenterState,
      handleDownload,
      loadFIle,
      file,
      loading,
      isSupportedFileType,
    });
  };

  return (props) => Comp(props);
};
