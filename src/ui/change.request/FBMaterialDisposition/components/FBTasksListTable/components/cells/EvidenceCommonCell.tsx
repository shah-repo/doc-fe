import React from 'react';
import { Mode, MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';
import { CustomTemplateProps } from '../../types';
import { UploadEvidenceCellTemplate } from './UploadEvidenceCellTemplate';

export const EvidenceCommonCell: React.FC<CustomTemplateProps> = (props) => {
  const mode = props?.dataItem?.[MODE_FIELD];

  if (mode === Mode.add) {
    return null;
  }

  return <UploadEvidenceCellTemplate {...props} />;
};
