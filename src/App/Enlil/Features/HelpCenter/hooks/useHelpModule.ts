import { useRef } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { SM } from "../../../..";
import { documentRevisionsSelectors } from "../../../../../state/ducks/documentRevisions";
import { pageDetailsSelectors } from "../../../../../state/ducks/pageDetails";
import { ApplicationState } from "../../../../../state/reducers";
import * as URL from "../../../../../ui/constants/urls";
import { HelpModule } from "../HelpCenter.types";

interface RouteChecker {
  module: HelpModule;
  check: (path: string) => boolean;
}

const ROUTES: RouteChecker[] = [
  {
    module: HelpModule.Dashboard,
    check: (path) => path === URL.HOME_URL,
  },
  {
    module: HelpModule.DocumentList,
    check: (path) => path === URL.DOCUMENT_REVISION_LIST_URL,
  },
  {
    module: HelpModule.ApprovalRequests,
    check: (path) => path.startsWith(URL.CHANGE_REQUEST_LIST_URL),
  },
  {
    module: HelpModule.GroupManagement,
    check: (path) => path.startsWith(URL.GROUP_MANAGEMENT_ROOT_URL),
  },
  {
    module: HelpModule.UserManagement,
    check: (path) => path.startsWith(URL.USER_MANAGEMENT_ROOT_URL),
  },
  {
    module: HelpModule.Training,
    check: (path) => path.startsWith(URL.TRAINING_URL),
  },
];

export default function useHelpModule(): HelpModule {
  const pathname = SM.pathname;
  const cachedModule = useRef(HelpModule.General);
  const categoriesList = useSelector(pageDetailsSelectors.byCategory);
  const categoryMatch = useRouteMatch(URL.DOCUMENT_BY_CATEGORY_LIST_URL);
  const documentMatch = useRouteMatch(URL.DOCUMENT_REVISION_VERSION_URL);
  const documentRevision = useSelector(
    (state: ApplicationState) => documentRevisionsSelectors.getDocumentRevision(
      state,
      documentMatch?.params.documentRevisionId,
    )
  );

  // Special case:
  // We should wait for document loading before getting its category
  // so returning cachedModule meanwile
  if (documentMatch && !documentRevision) {
    return cachedModule.current;
  }

  let currentModule = ROUTES.find((route) => route.check(pathname))?.module ?? HelpModule.General;

  const category = categoriesList[
    categoryMatch?.params.categoryName ?? documentRevision?.document?.documentType.category
  ];

  if (Object.values<string>(HelpModule).includes(category?.category)) {
    currentModule = category.category as HelpModule;
  }

  if (category?.config?.helpModule) {
    currentModule = category?.config.helpModule;
  }

  cachedModule.current = currentModule;

  return currentModule;
}
