import React from 'react';
import { useIntl } from 'react-intl';
import { FB, FBDownloadSheetTplState } from '..';
import { FBDownloadSheetTplProps } from './FBDownloadSheetTpl.types';

export const withFBDownloadSheetTpl = <T extends FBDownloadSheetTplProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    handleAction,
    downloadSheetTplState,
    ...props
  }: T) => {

    const intl = useIntl();

    downloadSheetTplState = FB.useRef<FBDownloadSheetTplState>(FBDownloadSheetTplState);
    const { workspaceState } = FB.useStores();
    const docRevId = workspaceState?.document?.id;

    handleAction = () => {
      downloadSheetTplState?.getBulkCreateTemplateId(docRevId as string, intl);
    };

    return Component({
      ...(props as T),
      handleAction,
      downloadSheetTplState,
    });
  };

  return (props: T) => Comp(props);
};
