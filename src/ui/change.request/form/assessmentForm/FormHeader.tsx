import { Grid } from '@material-ui/core';
import React from 'react';
import { ChangeRequest } from '../../../../state/ducks/changeRequest/types';
import { AsyncState, AsyncStatus } from '../../../../state/types';
import Header from '../../../components/common/header/Header';
import HeaderInfo from '../../../components/common/header/HeaderInfo';
import HeaderLastSaved from '../../../components/common/header/HeaderLastSaved';
import FormMessage from '../../../components/forms/FormMessage';
import FormProgress from '../../../components/forms/FormProgress';
import Actions from './Actions';

interface Props {
  changeRequest?: ChangeRequest
  asyncState: AsyncState
}

const FormHeader: React.FC<Props> = ({
  changeRequest,
  asyncState,
}) => (
  <Header>
    {changeRequest && (
      <HeaderInfo
        status={changeRequest.state}
        id={changeRequest.crId}
        name={changeRequest.title}
        documentTypeAcronym={changeRequest?.documentType?.documentTypeAcronym}
      />
    )}
    <Grid item xs={changeRequest ? 6 : 12} justify="flex-end">
      <Grid container alignItems="center" justify="flex-end">
        {changeRequest?.updatedAt && (
          <HeaderLastSaved
            timestamp={changeRequest.updatedAt}
            loading={asyncState.status === AsyncStatus.Active}
          />
        )}
        <Grid item>
          <Actions
            {...{
              changeRequest,
              asyncState,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
    <FormMessage asyncState={asyncState} />
    <FormProgress asyncState={asyncState} attached />
  </Header>
);

export default FormHeader;
