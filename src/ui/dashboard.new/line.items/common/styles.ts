import { createStyles, Theme } from '@material-ui/core';
import { CSSProperties } from 'react';
import Colors from '../../../layout/theme/utils/colors';

export const lineItemStyles = (theme: Theme) => createStyles({
  inline: {
    display: 'inline',
  },
  link: {
    'color': Colors.black,
    'textDecoration': 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  linkText: {
    fontSize: 14,
    fontWeight: 400,
    color: Colors.navy,
  },
  linkTextColor: {
    color: Colors.navy,
  },
  avatar: {
    width: 30,
    height: 30,
    fontSize: 12,
    color: Colors.white,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  gridContainer: {
    paddingLeft: 16,
    flexGrow: 1,
  },
  nested: {
    flexGrow: 1,
    width: 'auto',
    marginLeft: theme.spacing(4),
    paddingLeft: theme.spacing(3),
    borderLeft: `1px solid ${Colors.light_gray_blue}`,
    cursor: 'unset',
  },
  collapsedList: {
    backgroundColor: Colors.sky_blue,
  },
  listItem: {
    paddingLeft: 1,
    cursor: 'unset',
  },
  icon: {
    width: 15,
    cursor: 'pointer',
  },
  actionIcons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 1.25),
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    background: Colors.sky_blue,
  },
  actionIcon: {
    paddingLeft: theme.spacing(1.25),
  },
  attachmentIcon: {
    paddingTop: theme.spacing(.25),
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  buttoncursor: {
    cursor: 'unset',
  },
  margin5: {
    marginRight: 5,
  },
  margin7: {
    marginRight: 7,
  },
  typography: {
    'fontSize': 14,
    'fontWeight': 400,
    '& > p': { margin: 0 },
    'letterSpacing': 0,
  },
  typographyBold: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0,
  },
  typographyChildrenBold: {
    fontSize: 14,
    fontWeight: 700,
  },
  typographyStatus: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 1.1,
    letterSpacing: 0,
  },
  typographyAssigned: {
    fontWeight: 'bold',
    fontSize: 13,
    color: Colors.font_gray,
    letterSpacing: 0,
  },
  timestampContainer: {
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 1.85,
    letterSpacing: 0,
    color: Colors.font_gray,
  },
  truncateText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  customTooltipWidth: {
    maxWidth: 500,
  },
  viewTooltipText: {
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 1.25,
  },
  grayDot: {
    width: 4,
    height: 4,
    position: 'relative',
    background: Colors.font_gray,
  },
});

export const grayDotStyles = (theme: Theme, additional?: CSSProperties ) => createStyles({
  grayDot: {
    width: 4,
    height: 4,
    position: 'relative',
    background: Colors.font_gray,
    ...additional,
  },
});
