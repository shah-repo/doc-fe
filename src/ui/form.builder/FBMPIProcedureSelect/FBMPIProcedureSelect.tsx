import { Box, Typography } from '@material-ui/core';
import { Observer } from 'mobx-react';
import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { DOCUMENT_REVISION_LOT_STATUS, FBAutocomplete, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBForm, FBMPIProcedureSelectProps, FBProcedureItemType, FBQuantityUnitField } from '..';
import { getFormattedDateString, MomentFormats } from '../../../common/utils/date';
import { DOC_TYPE_GROUP_OPTION } from '../../../state/ducks/documentRevisions/documentType/types';
import Text from '../../components/Text';
import { checkIsDocumentLot } from '../../documentRevision/helpers/checkDocumentGroup';
import { isDocumentRevisionReleased } from '../../documentRevision/helpers/documentRevisionStatus';
import Colors from '../../layout/theme/utils/colors';
import { withFBMPIProcedureSelect } from './FBMPIProcedureSelect.wrap';

function getOptionLabel (option) {
  const lotPartRevision = option.precalc?.lot_part_revision !== 'N/A' ? option.precalc?.lot_part_revision : '';
  const part = [option.precalc?.lot_part, lotPartRevision].filter(Boolean).join('.');
  return [option.document.docId, part].filter(Boolean).join(' | ');
}

const FBMPIProcedureSelect: React.FunctionComponent<FBMPIProcedureSelectProps> = ({
  isOptionDisabled,
  renderOptionWithDate,
  onChange,
  mpiProcedureSelectState,
  formState,
  children,
  unitDisabled = false,
  initialValues,
  type,
  selectedEQ,
  isLHRProductionBuild,
}) => {
  // TODO implement filtering on BE
  const isValidLOT = (lot) => {
    const isAcceptedStatus = isLHRProductionBuild
      ? lot?.lotStatus === DOCUMENT_REVISION_LOT_STATUS.ACCEPTED || lot?.lotStatus === DOCUMENT_REVISION_LOT_STATUS.USE_AS_IS
      : lot?.lotStatus !== DOCUMENT_REVISION_LOT_STATUS.REJECTED && lot.lotStatus !== DOCUMENT_REVISION_LOT_STATUS.SCRAP;

    const isZeroOnHandQuantity = parseFloat(lot?.precalc?.lot_on_hand_quantity) === 0;

    return isAcceptedStatus && !isZeroOnHandQuantity;
  };

  const getLotOptions = () => mpiProcedureSelectState?.lotsApi.data
    ?.filter((option) => {
      return option.document.documentType.groupOptions?.includes(DOC_TYPE_GROUP_OPTION.TABS_PART_LOT) || (isDocumentRevisionReleased(option.status)
  && checkIsDocumentLot(option.document.documentType.groupOptions)
  && isValidLOT(option));
    });

  return (
    <FBForm {...{ formState }} >
      {type !== FBProcedureItemType.equipment
        ? (
          <Observer>
            {() => (
              <>
                <FBAutocomplete
                  label="form.builder.lot.number"
                  name="usedOverride"
                  options={getLotOptions()}
                  loading={mpiProcedureSelectState?.lotsApi.loading}
                  optionValueKey="id"
                  optionLabelKey="document.docId"
                  optionValueType="object"
                  renderOption={getOptionLabel}
                  getOptionLabel={getOptionLabel}
                  inputPropStyleSize="small"
                  customStyles = {{ height: 40 }}
                  inputStyle={{ padding: 0 }}
                />
                <FBQuantityUnitField gutter={false} {...{ initialValues, unitDisabled }} />
              </>
            )}
          </Observer>
        )
        : (
          <>
            <FBAutocompleteAsync
              label="form.builder.equipment"
              name="usedOverride"
              optionId={FBAutocompleteAsyncOption.releasedEquipment}
              optionValueKey="id"
              optionLabelKey="document.docId"
              optionValueType="id"
              renderOption={(option) => renderOptionWithDate?.(option)}
              getOptionDisabled={(option) => isOptionDisabled?.(option)}
              onChange={() => onChange?.()}
            />
            {selectedEQ && <>
              {selectedEQ.status
            && <Box mb={3} fontWeight="bold">
              <Typography style={{ color: Colors.font_gray, fontWeight: 'bold' }}>
                <Text message="common.status" />:
              </Typography>
              {selectedEQ?.status}
            </Box>
              }
              {selectedEQ.calDate
            && <Box mb={3}>
              <Typography style={{ color: Colors.font_gray, fontWeight: 'bold' }}>
                <Text message="form.builder.calibration" />:
              </Typography>
              <Text message="common.next" />: <Box component="span" fontWeight="bold">
                {getFormattedDateString(selectedEQ.calDate, MomentFormats.BriefDate)}
              </Box>
            </Box>
              }
              {selectedEQ.pmDate
            && <Box>
              <Typography style={{ color: Colors.font_gray, fontWeight: 'bold' }}>
                <Text message="form.builder.preventative.maintenance" />:
              </Typography>
              <Text message="common.next" />: <Box component="span" fontWeight="bold">
                {getFormattedDateString(selectedEQ.pmDate, MomentFormats.BriefDate)}
              </Box>
            </Box>
              }
            </>}
          </>
        )}
      {children}
    </FBForm>
  );
};
export default withFBMPIProcedureSelect(FBMPIProcedureSelect);
