import { Box } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useState } from 'react';
import { FBButton, FBStarterProps } from '..';
import SM from '../../../App/Shifamed/Utils/SM/SM';
import { checkIsDocumentEquipment } from '../../documentRevision/helpers/checkDocumentGroup';
import Colors from '../../layout/theme/utils/colors';
import { styles } from './FBStarter.styles';
import { withFBStarter } from './FBStarter.wrap';

const FBStarter: React.FunctionComponent<FBStarterProps> = ({
  index = 0,
  onClick,
  isNewLayout,
}) => {
  const classes = styles();
  const [isHover, setIsHover] = useState(false);
  const { _tabsState } = SM.useStores();
  const { _documentRevisionFormState } = SM.useStores();

  const isEQ = checkIsDocumentEquipment(
    _documentRevisionFormState?.documentRevision?.document?.documentType?.groupOptions,
  );
  if (isNewLayout) {
    return (
      <Box
        display="flex"
        className="fbStarterAddField"
        mb={1}
        mt={6}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Box
          border={0}
          borderTop={1}
          my="auto"
          width="100%"
          color={Colors.navy}
          style={{ borderStyle: isHover ? 'solid' : 'dashed' }}
        />
        <FBButton
          className={classes.button}
          label={
            (_tabsState?.isTabActive('specification') && isEQ)
              ? 'form.builder.addEquiSpec'
              : 'form.builder.add.field'
          }
          dataCy="form.builder.add.field"
          size="medium"
          variant="contained"
          fullWidth={true}
          isHover={isHover}
          showNewButton={isNewLayout}
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => onClick && onClick(index)}
        />
        <Box
          border={0}
          borderTop={1}
          my="auto"
          width="100%"
          color={Colors.navy}
          style={{ borderStyle: isHover ? 'solid' : 'dashed' }}
        />
      </Box>
    );
  }
  return (
    <Box
      display="flex"
      my={1}
      border={1}
      style={{ borderStyle: 'dashed' }}
    >
      <FBButton
        label="form.builder.add.field"
        dataCy="form.builder.add.field"
        color="primary"
        size="medium"
        variant="text"
        className={classes.button}
        fullWidth={true}
        onClick={() => onClick && onClick(0)}
      />
    </Box>
  );
};

export default withFBStarter(FBStarter);
