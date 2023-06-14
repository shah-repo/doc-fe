import React from 'react';
import Text from '../../../../components/Text';
import useStyles from './RelatedPart.styles';

const RelatedPartsTableHeader: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.tableHead} data-cy="related-parts-table">
      <div className={classes.tableCellOne}>
        <Text translation="relatedParts.grid.heading.docId" />
      </div>
      <div className={classes.tableCellTwo}>
        <span className={classes.verticalDivider}>
          <Text translation="relatedParts.grid.heading.title" />
        </span>
      </div>
      <div className={classes.tableCellThree}>
        <span className={classes.verticalDivider}>
          <Text translation="relatedParts.grid.heading.obsolete" />
        </span>
      </div>
      <div className={classes.tableCellFour} />
    </div>
  );
};

export default RelatedPartsTableHeader;
