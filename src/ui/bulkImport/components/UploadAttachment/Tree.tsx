import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Collapse from '@material-ui/core/Collapse';
import { Theme, createStyles, withStyles } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import React from 'react';
import { Colors } from '../../../layout/theme-next';
import useStyles from './styles';

function TransitionComponent (props: TransitionProps) {
  return (
    <Collapse {...props} />
  );
}

const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      position: 'relative',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        bottom: 12,
        left: 0,
        borderLeft: `1px solid ${Colors.lightGray}`,
      },
    },
    content: {
      position: 'relative',
      marginTop: 10,

      '&:before': {
        content: '""',
        position: 'absolute',
        left: -18,
        top: '50%',
        width: 22,
        borderTop: `1px solid ${Colors.lightGray}`,
        transform: 'translateY(-50%)',
      },
    },
    label: {
      fontSize: 14,
    },
  }),
)((props: TreeItemProps) => <TreeItem {...props} TransitionComponent={TransitionComponent} />);

const CustomizedTreeView: React.FC = () => {
  const classes = useStyles();

  return (
    <TreeView
      className={classes.rootTree}
      defaultExpanded={['1', '2']}
      defaultCollapseIcon={<FontAwesomeIcon
        className={classes.iconFolderOpen}
        icon={solid('folder-open')}
      />}
      defaultExpandIcon={<FontAwesomeIcon
        className={classes.iconFolder}
        icon={solid('folder')}
      />}
      defaultEndIcon={<FontAwesomeIcon
        className={classes.iconFolder}
        icon={solid('folder')}
      />}
    >
      <StyledTreeItem nodeId="1" label="Folder.zip" classes={{ content: classes.contentRoot }}>
        <StyledTreeItem nodeId="2" label="ECO-00001">
          <StyledTreeItem nodeId="5" label="MPI-00001.1 - Title of the document" />
          <StyledTreeItem nodeId="6" label="SOP-00001.1 - Title of the document" />
          <StyledTreeItem nodeId="7" label="SOP-00002.1 - Title of the document" />
          <StyledTreeItem nodeId="8" label="TRN-00001.1 - Title of the document" />
        </StyledTreeItem>
        <StyledTreeItem nodeId="3" label="ECO-00002" />
        <StyledTreeItem nodeId="4" label="ECO-00003" />
      </StyledTreeItem>
    </TreeView>
  );
};

export default CustomizedTreeView;
