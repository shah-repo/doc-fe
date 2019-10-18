import { Box } from "@material-ui/core";
import { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import apiClient from "../../../../state/apiClient";
import refreshTokenOperation from "../../../../state/middlewares/api/refreshToken";
import { AsyncActionErrorResponse } from "../../../../state/middlewares/api/types";
import { store } from "../../../../state/store";
import { SelectOption } from "../../../components/forms/fields/Select";
import { withAutocompleteDefaults } from "../../hocs/withAutocompleteDefaults";
import { FBAutocompleteConfig, FBAutocompleteProps } from "../../types/autocomplete";
import { tempOtions } from "../editors/FBAutocompleteEditor";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  labelRenderer,
  autocompleteList,
  disabled,
  readOnly,
  ...props
}) => {

  // *NOTE: For demo only. Will be removed
  const [options, setOptions] = useState<SelectOption[]>([]);
  useEffect(() => {
    if (!autocompleteList) { return; }

    const config: FBAutocompleteConfig[] =
      tempOtions.filter((conf) => conf.id === autocompleteList);

    if (!Array.isArray(config) && !(config || []).length) { return; }
    const selected = config[0];

    const api = async () => {
      try {
        const requestConfig: AxiosRequestConfig = {
          method: "get",
          url: selected.url,
          headers: {},
        };

        await refreshTokenOperation(store.dispatch, store.getState());
        requestConfig.headers.Authorization = store.getState().auth.tokens.id.value;

        let { data } = await apiClient.request(requestConfig);

        if (data.optionalApprovers) {
          data = data.optionalApprovers;
        }
        const opt = data.map((rec: any) => ({
          value: rec.id,
          label: rec[`${selected.renderKey}`],
        }));

        setOptions(opt);

      } catch (exception) {
        let responseMessage: string = "";

        if (exception.response) {
          const { data: { message } } = exception.response as AsyncActionErrorResponse;
          responseMessage = (Array.isArray(message)) ? message.join("; ") : message;
        }
        setOptions([]);
      }
    };

    api();
  }, []);

  return (
    <Box mb={4}>
      {labelRenderer}
      <Select
        inputId={`react-select-${props.name}`}
        TextFieldProps={{
          InputLabelProps: {
            htmlFor: `react-select-${props.name}`,
            shrink: true,
          },
        }}
        isDisabled={disabled || readOnly}
        {...props}
        options={options}
      />
    </Box>
  );
};

export default withAutocompleteDefaults(FBAutocomplete);
