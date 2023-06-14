import { Box, BoxProps, Grid, IconButton, ListItem, Tooltip, Typography } from '@material-ui/core';
import { HighlightOffOutlined } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { stripTags } from '../../../common/utils/helpers';
import { DataProps } from '../../../state/ducks/common/types';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import Text from '../../components/Text';
import Colors from '../../layout/theme/utils/colors';
import { documentVersionPath } from '../utils/paths';
import { styles } from './builds.presenter.styles';

interface OwnProps {
  label: string
  isDraft?: boolean
  handleRemoveBuild: () => void
  showRemoveButton?: boolean
  labelFont?: BoxProps
}

type Props = OwnProps & DataProps<DocumentRevision[]>;
const BuildsPresenter: React.FunctionComponent<Props> = ({
  dataProp,
  label,
  isDraft,
  showRemoveButton,
  handleRemoveBuild,
  labelFont,
}) => {
  const classes = styles();

  const referencesRenderer = () =>
    dataProp.map((docRev: any, index) => (
      <Box component="span" key={`${docRev.id}-${index}`}
        width="max-content"
        px={1}
        py={0.5}
        mr={2}
        mb={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
        borderRadius={4}
        bgcolor={Colors.light_blue}
      >
        <Link
          className={classes.link}
          to={documentVersionPath(docRev.id, docRev.document?.id )}
          target="_blank"
          data-cy={`BuildsPresenter-link-${label}`}
        >
          <Typography
            id="BuildsPresenter-buildtext"
            variant="caption"
            color="primary"
            noWrap={true}
            className={classes.styleFont}
          >
            {`${docRev.document?.docId} - ${stripTags(docRev.name)}`}
          </Typography>
        </Link>
        {showRemoveButton
        && (<Tooltip id="tooltip-removeBuild" title={<Text translation="common.remove" />}>
          <IconButton
            id="removeBuild"
            aria-label="removeBuild"
            onClick={() => handleRemoveBuild()}
            style={{ padding: 0 }}
          >
            <HighlightOffOutlined fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>)
        }
      </Box>
    ));

  const buildsEmptyRenderer = () => (
    <Box pb={2}>
      <Typography variant="h5" className={classes.labelFont}>
        <Text message="common.none" />
      </Typography>
    </Box>
  );
  return (
    <Grid xs={6}>
      <Box pb={1.75}>
        <ListItem data-cy="BuildsPresenter-label" disableGutters>
          <Typography variant="h6" className={classes.labelProps}>
            <Text message={label} />
          </Typography>
        </ListItem>
        <Box display="flex">
          {referencesRenderer()}
        </Box>
        {!dataProp.length && buildsEmptyRenderer()}
      </Box>
    </Grid>
  );
};

export default BuildsPresenter;
