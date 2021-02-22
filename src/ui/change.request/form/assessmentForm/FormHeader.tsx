import { Grid } from "@material-ui/core";
import React from "react";
import { ChangeRequest } from "../../../../state/ducks/changeRequest";
import { AsyncState } from "../../../../state/types";
import Header from "../../../components/common/header/Header";
import HeaderInfo from "../../../components/common/header/HeaderInfo";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import Actions from "./Actions";

interface Props {
  changeRequest?: ChangeRequest;
  asyncState: AsyncState;
}

const FormHeader: React.FunctionComponent<Props> = ({
  changeRequest,
  asyncState,
}) => (
  <Header>
    {changeRequest &&
        <HeaderInfo
          status={changeRequest.state}
          id={changeRequest.crId}
          name={changeRequest.title}
        />}
    <Grid item={true} xs={changeRequest ? 6 : 12} justify="flex-end">
      <Grid container={true} alignItems="flex-end" justify="flex-end">
        <Actions
          {...{
            changeRequest,
            asyncState,
          }}
        />
      </Grid>
    </Grid>
    <FormMessage asyncState={asyncState} />
    <FormProgress asyncState={asyncState} fullWidth />
  </Header>
);

export default FormHeader;
