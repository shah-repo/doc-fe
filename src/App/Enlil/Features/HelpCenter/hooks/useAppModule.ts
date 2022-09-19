import { useRef } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { SM } from "../../../..";
import { documentRevisionsSelectors } from "../../../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../../../state/reducers";
import * as URL from "../../../../../ui/constants/urls";
import { Module } from "../data/modules";

interface RouteChecker {
  module: Module;
  check: (path: string) => boolean;
}

export const ROUTES: RouteChecker[] = [
  {
    module: Module.Dashboard,
    check: (path) => path === URL.HOME_URL,
  },
  {
    module: Module.DocumentList,
    check: (path) => path === URL.DOCUMENT_REVISION_LIST_URL,
  },
  {
    module: Module.ApprovalRequests,
    check: (path) => path.startsWith(URL.CHANGE_REQUEST_LIST_URL),
  },
  {
    module: Module.GroupManagement,
    check: (path) => path.startsWith(URL.GROUP_MANAGEMENT_ROOT_URL),
  },
  {
    module: Module.UserManagement,
    check: (path) => path.startsWith(URL.USER_MANAGEMENT_ROOT_URL),
  },
  {
    module: Module.Training,
    check: (path) => path.startsWith(URL.TRAINING_URL),
  },
];

export default function useAppModule(): Module {
  const pathname = SM.pathname;
  const cachedModule = useRef<Module>(Module.General);
  const categoryMatch = useRouteMatch(URL.DOCUMENT_BY_CATEGORY_LIST_URL);
  const documentMatch = useRouteMatch(URL.DOCUMENT_REVISION_VERSION_URL);
  const documentRevision = useSelector(
    (state: ApplicationState) => documentRevisionsSelectors.getDocumentRevision(
      state,
      documentMatch?.params?.documentRevisionId
    )
  );

  // Special case:
  // We should wait for document loading before getting its category
  // so returning cachedModule meanwile
  if (documentMatch && !documentRevision) {
    return cachedModule.current;
  }

  let moduleName: string | undefined;
  let currentModule = ROUTES.find((route) => route.check(pathname))?.module ?? Module.General;

  if (categoryMatch) {
    moduleName = categoryMatch.params.categoryName;
  }

  if (documentRevision) {
    moduleName = documentRevision.document.documentType.category;
  }

  if (moduleName && Object.values<string>(Module).includes(moduleName)) {
    currentModule = moduleName as Module;
  }

  cachedModule.current = currentModule;

  return currentModule;
}
