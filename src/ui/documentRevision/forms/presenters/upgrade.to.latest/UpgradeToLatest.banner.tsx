import { Box, Link } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';
import React from 'react';
import Text from '../../../../components/Text';
import useDialog from '../../../../hooks/useDialog';
import Colors from '../../../../layout/theme/utils/colors';
import { UpgradeToLatestDialog } from './UpgradeToLatestDialog';

interface Props {
  shouldShowUpgrade?: boolean
  shouldShowSyncForRelatedEquipment?: boolean
  onUpgradeClick: () => void
}

const UpgradeToLatestBanner: React.FunctionComponent<Props> = ({
  shouldShowUpgrade = false,
  shouldShowSyncForRelatedEquipment = false,
  onUpgradeClick,
}) => {
  const [showBanner, setShowBanner] = React.useState(true);
  const hideBanner = () => setShowBanner(false);
  const dialog = useDialog();

  const handleClickHere = shouldShowSyncForRelatedEquipment
    ? onUpgradeClick
    : dialog.open;

  const shouldShow = shouldShowUpgrade || shouldShowSyncForRelatedEquipment;

  return (
    <>
      {shouldShow && showBanner && (
        <>
          <Box
            bgcolor={Colors.blue}
            color={Colors.white}
            fontWeight="bold"
            display="flex"
            alignItems="center"
            margin="10px"
            marginTop={0}
            borderRadius={6}
            px={2}
            py={1}
          >
            <WarningOutlinedIcon color="inherit" />
            <Box component="span" ml={1.5}>
              <Text
                translation={
                  shouldShowSyncForRelatedEquipment
                    ? 'document.revision.sync.related.equipment.banner'
                    : 'document.revision.upgrade.form.banner'
                }
                values={{
                  clickHere: (
                    <Link
                      onClick={handleClickHere}
                      data-cy="formUpgradeButton"
                      component="button"
                      color="inherit"
                      style={{
                        color: Colors.white,
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        fontSize: 'inherit',
                        verticalAlign: 'baseline',
                      }}
                    >
                      <Text translation="common.click.here" />
                    </Link>
                  ),
                }}
              />
            </Box>
            <CloseIcon onClick={hideBanner} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
          </Box>
          <UpgradeToLatestDialog {...{ dialog, onUpgradeClick }} />
        </>
      )}
    </>
  );
};

export default UpgradeToLatestBanner;
