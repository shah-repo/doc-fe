import { useLocation } from "react-router-dom";
import Modules from "../data/modules";

export default function useAppModule(): Modules {
  const location = useLocation();

  if (location.pathname.startsWith("/change_request")) {
    return Modules.ApprovalRequests;
  }

  return Modules.General;
}
