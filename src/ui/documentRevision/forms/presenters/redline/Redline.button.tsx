import { Button } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { SM } from '../../../../../App';
import { StyledButton } from '../../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import { ReactComponent as RedlineIcon } from '../../../../../assets/images/redline.svg';
import { companyActions } from '../../../../../state/ducks/company';
import Text from '../../../../components/Text';

interface Props {
  isUserDocumentOwner: boolean;
  docTypeHasRedline: boolean;
  isLHRProductionBuild: boolean;
  renderAsButton?: boolean;
}

const RedlineButton: React.FunctionComponent<Props> = ({
  isUserDocumentOwner,
  docTypeHasRedline,
  isLHRProductionBuild,
  renderAsButton,
}) => {
  const isNewLayout = SM.isNewLayout;
  const { _formState } = SM.useStores();
  const dispatch = useDispatch();

  const handleClick = () => {
    _formState?.setMode('formDesign');
    dispatch(companyActions.redlineConfig(true));
    dispatch(companyActions.autosaveConfig());
    _formState?.setDirty(true);
  };

  if (!isUserDocumentOwner || !docTypeHasRedline || isLHRProductionBuild) {
    return null;
  }
  if (isNewLayout) {
    if (!renderAsButton) {
      return <StyledMenuListItem button alignItems="flex-start" onClick={handleClick}>
        <StyledMenuListIcon><RedlineIcon/></StyledMenuListIcon>
        <StyledMenuListItemText
          data-cy="redlineButton"
          id="Redline"
          primary={ <Text translation="common.redline" />}
        />
      </StyledMenuListItem>;
    }
    return (
      <StyledButton
        color="primary"
        data-cy="redlineButton"
        onClick={() => handleClick()}
        id="Redline"
      >
        <Text translation="common.redline" />
      </StyledButton>
    );
  }
  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => handleClick()}
        id="Redline"
      >
        <Text translation="common.redline"/>
      </Button>
    </>
  );
};

export default RedlineButton;
