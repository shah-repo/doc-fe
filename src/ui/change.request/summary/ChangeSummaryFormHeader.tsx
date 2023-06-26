import { Box } from '@material-ui/core';
import { Observer } from 'mobx-react';
import CustomLabelTooltip from '../../hooks/docCustomization/CustomLabelTooltip';
import { useTitle } from '../../hooks/docCustomization/useCustomization';
import useDescription from '../../hooks/docCustomization/useDescription';

import FormMessage from '../../components/forms/FormMessage';
import FormProgress from '../../components/forms/FormProgress';

import React from 'react';
import { AsyncState } from '../../../state/types';
import SummaryField from '../../common/summary/NewBase';
import SummaryFieldWithHtml from '../../common/summary/NewBaseWithHtml';

interface ChangeSummaryFormHeaderProps {
  title?: string
  description?: string
  isDisabledInput?: boolean
  documentTypeId?: string
  canEdit: boolean
  asyncState: AsyncState
}

const ChangeSummaryFormHeader: React.FunctionComponent<ChangeSummaryFormHeaderProps> = ({
  title,
  description,
  documentTypeId,
  canEdit,
  asyncState,
}) => {

  const { isVisible: isDescriptionVisible, label: descriptionLabel } = useDescription(documentTypeId);
  const { isVisible: isTitleVisible, label: titleLabel, tooltipConfig } = useTitle(documentTypeId);

  return (
    <Observer>
      {() => (
        <Box px={4.25} paddingBottom={2.5}>
          <Box paddingBottom={2} paddingTop={1}>
            {canEdit && <FormProgress asyncState={asyncState} />}
            {canEdit && <FormMessage asyncState={asyncState} />}
            {isTitleVisible && (
              <CustomLabelTooltip {...{ tooltipConfig }}>
                <SummaryField label={titleLabel} value={title} />
              </CustomLabelTooltip>
            )}
          </Box>
          {isDescriptionVisible && (
            <SummaryFieldWithHtml label={descriptionLabel} value={description} />
          )}
        </Box>
      )}
    </Observer>
  );
};

export default ChangeSummaryFormHeader;
