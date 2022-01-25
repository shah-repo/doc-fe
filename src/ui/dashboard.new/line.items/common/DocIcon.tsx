import React from "react";
import { ReactComponent as FMIcon } from "../../../../assets/images/FM.svg";
import { ReactComponent as MPIIcon } from "../../../../assets/images/MPI.svg";
import { ReactComponent as ApprovalIcon } from "../../../../assets/images/pending_approval.svg";
import { ReactComponent as POIcon } from "../../../../assets/images/PO.svg";
import { ReactComponent as SOPIcon } from "../../../../assets/images/SOP.svg";
import { ReactComponent as TrainingIcon } from "../../../../assets/images/training.svg";
import {
  RecentDocTypeGroups,
} from "../../../../state/ducks/dashboard.new/recents/types";

export const getDocIcon = (docTypeGroup: RecentDocTypeGroups) => {
  switch (docTypeGroup) {
    case RecentDocTypeGroups.CHANGE_REQUEST:
      return <ApprovalIcon height={30} width={30} />;
    case RecentDocTypeGroups.PO:
      return <POIcon height={30} width={30} />;
    case RecentDocTypeGroups.PI:
      return <MPIIcon height={30} width={30} />;
    case RecentDocTypeGroups.FORM:
      return <FMIcon height={30} width={30} />;
    case RecentDocTypeGroups.SUPPLIER:
      return <SOPIcon height={30} width={30} />;
    case RecentDocTypeGroups.TRAINING_CURRICULUM:
      return <TrainingIcon height={30} width={30} />;
    default:
      return <SOPIcon height={30} width={30} />;
  }
};
