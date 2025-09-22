import { AppName, Widget, WidgetRef } from 'ai-widget';
import React, { createContext, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { translate } from '../../common/intl';
import { getHasPermission, hasActivePremiumFeatureSubscription } from '../../common/utils/selectors';
import Config from '../../config';
import { authSelectors } from '../../state/ducks/auth';
import { Permission } from '../../state/ducks/auth/types';
import { companySelectors } from '../../state/ducks/company';
import { PremiumFeature } from '../../state/ducks/company/types';
import { documentRevisionsSelectors } from '../../state/ducks/documentRevisions';
import { ApplicationState } from '../../state/reducers';
import { store } from '../../state/store';
import {
  DOCUMENT_REVISION_VERSION_URL,
} from '../constants/urls';

interface AiWidgetContextType {
  isWidgetActive: boolean
  summarizeAttachments: (attachmentIds: string[]) => void
  updateAttachments: (attachmentIds: string[]) => void
}

export const AiWidgetContext = createContext<AiWidgetContextType | undefined>(undefined);

interface AiWidgetProviderProps {
  children: React.ReactNode
}

export const AiWidgetProvider: React.FC<AiWidgetProviderProps> = ({ children }) => {
  const hasActiveAiFeature = useSelector(hasActivePremiumFeatureSubscription(PremiumFeature.AI));
  const hasAiPermission = useSelector(getHasPermission(Permission.PREMIUM_AI));
  const isWidgetActive = hasActiveAiFeature && hasAiPermission;
  const userName = (useSelector(authSelectors.currentUserName) ?? '').trim();
  const documentMatch = useRouteMatch(DOCUMENT_REVISION_VERSION_URL);
  const companyId = useSelector(companySelectors.companyIdSelector);
  const documentRevisionId = documentMatch?.params?.documentRevisionId;
  const accessToken = `Bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`;
  const dummyPrompts = promptKeys.map((key) => translate(key));
  const location = useLocation();
  const documentRevision = useSelector(
    (state: ApplicationState) => documentRevisionsSelectors.getDocumentRevision(
      state,
      documentRevisionId ?? '',
    ),
  );
  const defaultAttachmentIds = documentRevision?.attachments?.map(item => item.id) ?? [];
  const schema = documentRevision?.formDocument?.formTemplate?.schema ?? [];
  const formInput = documentRevision?.formInput ?? {};
  const fileUploadFields = schema
    .filter(item => item.type === 'fileupload')
    .map(item => item.name);
  const uploadedFileIds = fileUploadFields.reduce((acc: string[], name) => {
    if (!name) {
      return acc;
    }

    const ids = (formInput[name] ?? []).map(item => item?.id) as string[];
    acc.push(...ids);

    return acc;
  }, []);
  const attachmentIds = [...defaultAttachmentIds, ...uploadedFileIds].filter(Boolean);
  const widgetRef = useRef<WidgetRef>(null);

  const summarizeAttachments = useCallback((attachmentIds: string[]) => {
    widgetRef.current?.triggerSummarizeAttachments(attachmentIds);
  }, []);

  const updateAttachments = useCallback((attachmentIds: string[]) => {
    widgetRef.current?.triggerUpdateAttachments(attachmentIds);
  }, []);

  useEffect(() => {
    widgetRef.current?.triggerUpdateAttachments([]);
  }, [location.pathname]);

  if (!isWidgetActive) {
    return <>{children}</>;
  }

  return (
    <AiWidgetContext.Provider value={{ summarizeAttachments, updateAttachments, isWidgetActive }}>
      <Widget
        ref={widgetRef}
        appName={AppName.D2M}
        userName={userName}
        companyId={companyId}
        documentRevisionId={documentRevisionId}
        attachmentIds={attachmentIds}
        token={accessToken}
        apiPath={Config.ApiAIEndpoint}
        dummyPrompts={dummyPrompts}
      />
      {children}
    </AiWidgetContext.Provider>
  );
};

const promptKeys = [
  'example.prompt.requirements.list',
  'example.prompt.attachment.attachment',
  'example.prompt.compare,document',
  'example.prompt.find.document',
  'example.prompt.completed.training',
];
