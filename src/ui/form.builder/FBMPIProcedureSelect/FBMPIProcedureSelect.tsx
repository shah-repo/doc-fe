import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBForm, FBMPIProcedureSelectProps, FBTextField } from "..";
import { FBClasses } from "../defaults/layout";
import FBAutocomplete from "../FBAutocomplete/FBAutocomplete";
import FBQuantityUnitField from "../FBQuantityUnitField/FBQuantityUnitField";
import { withFBMPIProcedureSelect } from "./FBMPIProcedureSelect.wrap";

const FBMPIProcedureSelect: React.FunctionComponent<FBMPIProcedureSelectProps> = ({
  mpiProcedureSelectState,
  formState,
  children,
  initialValues,
}) => (
  <FBForm {...{ formState, initialValues }} >
    <FBTextField name="title" label="form.builder.title" className={FBClasses.inputPreview}  />
    <Box fontWeight="fontWeightMedium" borderBottom={1} pb={0.5} mb={5}>
      Lot
    </Box>
    <Observer>
      {() => (
        <>
          <FBAutocomplete
            label="Lot Number"
            name="usedLot"
            options={mpiProcedureSelectState?.lotsApi.data}
            loading={mpiProcedureSelectState?.lotsApi.loading}
            optionValueKey="id"
            optionLabelKey="document.docId"
            optionValueType="id"
          />
          <FBQuantityUnitField gutter={false} />
        </>
      )}
    </Observer>
    {children}
  </FBForm>
);

export default withFBMPIProcedureSelect(FBMPIProcedureSelect);
