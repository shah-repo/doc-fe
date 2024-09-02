import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SM } from '../../App';
import { authActions, authSelectors } from '../../state/ducks/auth';
import { GroupTag, Permission } from '../../state/ducks/auth/types';
import { companyActions, companySelectors } from '../../state/ducks/company';
import useGetHasPermission from '../hooks/useGetHasPermission';
import useGetHasTag from '../hooks/useGetHasTag';
import HeaderPresenter from './Header.presenter';
import { UserMenuContext } from './NavigationProfile.container';

interface HeaderContainerProps {
  onSidebarToggle: () => void
  isSidebarExpanded: boolean
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ isSidebarExpanded, onSidebarToggle }) => {
  const dispatch = useDispatch();
  const companyName = useSelector(companySelectors.companyNameSelector);
  const companyAvatar = useSelector(companySelectors.getWhiteLabeling).avatar;
  const canToggleCustomLabels = useGetHasTag(GroupTag.LABEL_TOOLTIPS);
  const canToggleAutosave = useGetHasPermission(Permission.DEVELOPERS);
  const isCustomLabelsEnabled = useSelector(authSelectors.isCustomLabelsOn);
  const isAutosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);
  const isFullHeight = SM.isHomeURL;

  const onAutosaveToggle = () => dispatch(companyActions.autosaveConfig());
  const onCustomLabelsToggle = () => dispatch(authActions.toggleCustomLabels(!isCustomLabelsEnabled));

  const { handleSwitchCompany } = React.useContext(UserMenuContext) ?? {};
  const onCompanyAvatarClick = handleSwitchCompany;

  return (
    <HeaderPresenter
      {...{
        companyName,
        companyAvatar,
        isSidebarExpanded,
        isFullHeight,
        isCustomLabelsEnabled,
        isAutosaveEnabled,
        canToggleCustomLabels,
        canToggleAutosave,
        onSidebarToggle,
        onAutosaveToggle,
        onCustomLabelsToggle,
        onCompanyAvatarClick,
      }}
    />
  );
};

export default HeaderContainer;
