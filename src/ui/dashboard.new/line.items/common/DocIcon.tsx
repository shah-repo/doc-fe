import React from "react";
import { ReactComponent as FMIcon } from "../../../../assets/images/FM.svg";
import { ReactComponent as MPIIcon } from "../../../../assets/images/MPI.svg";
import { ReactComponent as ApprovalIcon } from "../../../../assets/images/pending_approval.svg";
import { ReactComponent as POIcon } from "../../../../assets/images/PO.svg";
import { ReactComponent as SOPIcon } from "../../../../assets/images/SOP.svg";
import { ReactComponent as TrainingIcon } from "../../../../assets/images/training.svg";
import {
  DocTypeGroups,
} from "./types";

export const getDocIcon = (docTypeGroup: DocTypeGroups) => {
  switch (docTypeGroup) {
    case DocTypeGroups.CHANGE_REQUEST:
      return <ApprovalIcon height={30} width={30} />;
    case DocTypeGroups.PO:
      return <POIcon height={30} width={30} />;
    case DocTypeGroups.PI:
      return <MPIIcon height={30} width={30} />;
    case DocTypeGroups.FORM:
      return <FMIcon height={30} width={30} />;
    case DocTypeGroups.SUPPLIER:
      return <SOPIcon height={30} width={30} />;
    case DocTypeGroups.TRAINING_CURRICULUM:
      return <TrainingIcon height={30} width={30} />;
    default:
      return <SOPIcon height={30} width={30} />;
  }
};
