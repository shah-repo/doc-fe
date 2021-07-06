import { Box } from "@material-ui/core";
import React from "react";
import { FBForm, FBPOReceiveCreateLotProps, FBTextField } from "..";
import { FormContext } from "../../components/forms/FormContext";
import FBAutocomplete from "../FBAutocomplete/FBAutocomplete";
import FBDatePicker from "../FBDatePicker/FBDatePicker";
import { withFBPOReceiveCreateLot } from "./FBPOReceiveCreateLot.wrap";


const FBPOReceiveCreateLot: React.FunctionComponent<FBPOReceiveCreateLotProps> = ({
  children,
  item,
  formIds,
  documentTypes,
  handleDocTypeSelection,
}) => (
  <FBForm>
    <FormContext.Provider value={{ submitOnChange: false }}>
      <FBTextField
        label="form.builder.field.part.number.or.service"
        defaultValue={item?.partNumberDocId || item?.serviceId}
        disabled={true}
        hidden={!(item?.partNumberDocId || item?.serviceId)}
      />
      <FBTextField
        label="form.builder.field.supplier.part.number"
        defaultValue={item?.supplierPartNumber}
        disabled={true}
        hidden={!item?.supplierPartNumber}
      />
      <FBTextField
        label="form.builder.description"
        defaultValue={item?.partNumberTitle || item?.description}
        disabled={true}
      />
      <FBTextField
        label="form.builder.field.ordered"
        defaultValue={item?.order}
        disabled={true}
      />
      <Box display="flex" justifyContent="space-between">
        <Box width="100%" marginRight="10px">
          <FBTextField
            inputProps={{ type: "number", min: "0" }}
            defaultValue={item?.received}
            label="form.builder.quantity.received"
            name="received"
            rules="required|min:1"
          />
        </Box>
        <Box width="100%" marginLeft="10px">
          <FBTextField
            label="form.builder.field.units"
            defaultValue={item?.units}
            disabled={true}
          />
        </Box>
      </Box>
      <FBDatePicker
        label="form.builder.field.expiration.date"
        name="expirationDate"
      />
      <FBAutocomplete
        name="lotType"
        label="supplier.select.type"
        placeholder="supplier.select.type"
        options={documentTypes?.map((docType) => ({
          text: docType.documentTypeName,
          value: docType.id,
        }))}
        rules="required"
        onChange={handleDocTypeSelection}
      />
      <FBAutocomplete
        name="lotForm"
        label="supplier.select.form"
        placeholder="supplier.select.form"
        options={formIds?.map((form) => ({
          text: form.name,
          value: form.id,
        }))}
        rules="required"
      />
      {children}
    </FormContext.Provider>
  </FBForm>
);

export default withFBPOReceiveCreateLot(FBPOReceiveCreateLot);
