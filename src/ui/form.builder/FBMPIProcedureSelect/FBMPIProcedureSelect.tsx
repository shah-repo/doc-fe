import { Box, Typography } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBAutocomplete, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBForm, FBMPIProcedureSelectProps, FBProcedureItemType, FBQuantityUnitField } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import Text from "../../components/Text";
import { checkIsDocumentLot } from "../../documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft } from "../../documentRevision/helpers/documentRevisionStatus";
import Colors from "../../layout/theme/utils/colors";
import { withFBMPIProcedureSelect } from "./FBMPIProcedureSelect.wrap";

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
}) => (
  <FBForm {...{ formState }} >
    {type !== FBProcedureItemType.equipment
      ? (
        <Observer>
          {() => (
            <>
              <FBAutocomplete
                label="form.builder.lot.number"
                name="usedOverride"
                options={mpiProcedureSelectState?.lotsApi.data
                  ?.filter((option) =>
                    !isDocumentRevisionInDraft(option.status) &&
                    checkIsDocumentLot(option.document.documentType.groupOptions))
                }
                loading={mpiProcedureSelectState?.lotsApi.loading}
                optionValueKey="id"
                optionLabelKey="document.docId"
                optionValueType="object"
                renderOption={(option) =>
                  `${option.document.docId} | ${option.precalc?.lot_part || ""}`
                }
                getOptionLabel={(option) =>
                  `${option.document.docId} | ${option.precalc?.lot_part || ""}`
                }
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
            {selectedEQ.status &&
            <Box mb={3} fontWeight={"bold"}>
              <Typography style={{ color: Colors.font_gray, fontWeight: "bold"  }}>
                <Text message="common.status"/>:
              </Typography>
              {selectedEQ?.status}
            </Box>
            }
            {selectedEQ.calDate &&
            <Box mb={3}>
              <Typography style={{ color: Colors.font_gray, fontWeight: "bold" }}>
                <Text message="form.builder.calibration"/>:
              </Typography>
              <Text message="common.next"/>: <Box component={"span"} fontWeight={"bold"}>
                {getFormattedDateString(selectedEQ.calDate, MomentFormats.BriefDate)}
              </Box>
            </Box>
            }
            {selectedEQ.pmDate &&
            <Box>
              <Typography style={{ color: Colors.font_gray, fontWeight: "bold" }}>
                <Text message="form.builder.preventative.maintenance"/>:
              </Typography>
              <Text message="common.next"/>: <Box component={"span"} fontWeight={"bold"}>
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

export default withFBMPIProcedureSelect(FBMPIProcedureSelect);
