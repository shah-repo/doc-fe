import React from 'react';
import { ReactComponent as FMIcon } from '../../../../assets/images/FM.svg';
import { ReactComponent as MPIIcon } from '../../../../assets/images/MPI.svg';
import { ReactComponent as ApprovalIcon } from '../../../../assets/images/pending_approval.svg';
import { ReactComponent as POIcon } from '../../../../assets/images/PO.svg';
import { ReactComponent as SOPIcon } from '../../../../assets/images/SOP.svg';
import { ReactComponent as TrainingIcon } from '../../../../assets/images/training.svg';
import { STATUS_TYPES_LABEL } from '../../../../state/ducks/dashboard.new/my.feeds/types';
import {
  DocTypeGroups,
} from './types';

export const getDocIcon = (docTypeGroup: DocTypeGroups, height = 30, width = 30 ) => {
  switch (docTypeGroup) {
    case DocTypeGroups.CHANGE_REQUEST:
      return <ApprovalIcon height={height} width={width} />;
    case DocTypeGroups.PO:
      return <POIcon height={height} width={width} />;
    case DocTypeGroups.PI:
      return <MPIIcon height={height} width={width} />;
    case DocTypeGroups.FORM:
      return <FMIcon height={height} width={width} />;
    case DocTypeGroups.SUPPLIER:
      return <SOPIcon height={height} width={width} />;
    case DocTypeGroups.TRAINING_CURRICULUM:
      return <TrainingIcon height={height} width={width} />;
    default:
      return <SOPIcon height={height} width={width} />;
  }
};

export const getStatusLabel = (docTypeGroup: string, status: string, displaystatus: string) => {
  if (docTypeGroup === DocTypeGroups.PI_INSTANCE) {
    return displaystatus;
  }
  if (docTypeGroup === DocTypeGroups.PO && status === STATUS_TYPES_LABEL.RELEASED) {
    return STATUS_TYPES_LABEL.APPROVED;
  }
  return STATUS_TYPES_LABEL[status];
};
