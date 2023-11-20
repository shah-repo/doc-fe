import cx from 'classnames';
import React, { useEffect } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';

import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import Colors from '../../layout/theme/utils/colors';
import Text from '../Text';
import { whereUsedLotStaticData } from './staticData';
import { IRelation, IWhereUsedLot } from './whereUsed.interface';
import useStyles from './whereUsedTree.styles';

const Loader = () => {
  const classes = useStyles({ size: undefined });

  return (
    <div data-cy="tree-items-loader" className={classes.loader}>
      <Text translation="common.loading" />
    </div>
  );
};

export default function LotWhereUsedTreeCreator ({ lotRevId }: { lotRevId: string }): JSX.Element {
  // const [data, setData] = React.useState<IWhereUsedLot[]>();
  const [dataInLevels, setDataInLevels] = React.useState<{[key: string]: IWhereUsedLot[]}>();
  const [isLoading, setLoading] = React.useState(true);

  const [relationsMap, setRelationsMap] = React.useState<{[key: string]: IRelation[]}>();

  const classes = useStyles({ size: undefined });

  useEffect(() => {
    setDataInLevels(depthMapper(whereUsedLotStaticData));
    setRelationsMap(relationMapper(whereUsedLotStaticData));
    setTimeout(() => setLoading(false), 1000);
  }, [lotRevId]);

  const depthMapper = (whereUsedLotData: IWhereUsedLot[]) => {
    const whereUsedDataDepthMap: {[key: string]: IWhereUsedLot[]} = {};
    whereUsedLotData.forEach((whereUsedEntry: IWhereUsedLot) => {
      const depthToUse = whereUsedEntry.depth.toString();
      if (!whereUsedDataDepthMap[depthToUse]) {
        whereUsedDataDepthMap[depthToUse] = [];
      }
      whereUsedDataDepthMap[depthToUse].push(whereUsedEntry);
    });
    return whereUsedDataDepthMap;
  };

  const relationMapper = (whereUsedLotData: IWhereUsedLot[]) => {
    const relationMap: {[key: string]: IRelation[]} = {};

    const whereUsedLotMap = {};
    whereUsedLotData.forEach(entry => {
      whereUsedLotMap[entry.lotRevId] = entry;
    });

    whereUsedLotData.forEach((whereUsedEntry: IWhereUsedLot) => {
      const childLotRevId = whereUsedEntry.childLotRevId;
      if (childLotRevId) {
        if (!relationMap[childLotRevId]) {
          relationMap[childLotRevId] = [];
        }
        relationMap[childLotRevId].push({
          targetId: idGenerator(whereUsedLotMap[whereUsedEntry.lotRevId]),
          targetAnchor: 'left',
          sourceAnchor: 'right',
        });
      }
    });
    console.log(relationMap);
    return relationMap;
  };

  const statusClassDecider = (parentDisplayStatus: string) => {
    if (parentDisplayStatus === DocumentRevisionStatus.Released) {
      return classes.statusReleased;
    } else if (parentDisplayStatus === DocumentRevisionStatus.Draft) {
      return classes.statusDraft;
    } else if (parentDisplayStatus === DocumentRevisionStatus.PendingChange) {
      return classes.statusPendingChange;
    }

    return classes.defaultStatus;
  };

  const idGenerator = (entry: IWhereUsedLot) => {
    return `${entry.lotRevId}:${entry.childLotRevId}:${entry.depth}`;
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={classes.treeMap}>
        <ArcherContainer
          strokeColor={Colors.bright_grey}
          // endShape={'circle' as ShapeType}
        >
          {
            dataInLevels && relationsMap && Object.keys(dataInLevels).map((level: string) => {
              const whereUsedEntries = dataInLevels[level];
              return (
                <div className={`depthDiv depth-${level}`}>
                  {
                    whereUsedEntries.map(whereUsedEntry => {
                      const { lotName, lhrName, displayRevision, displayStatus } = whereUsedEntry;
                      console.log(whereUsedEntry.lotRevId, relationsMap[whereUsedEntry.lotRevId]);
                      return (
                        <ArcherElement
                          id = {idGenerator(whereUsedEntry)}
                          relations= {relationsMap[whereUsedEntry.lotRevId] ?? []}
                        >
                          <div
                            className={cx(classes.entry, statusClassDecider(displayStatus))}
                            id={idGenerator(whereUsedEntry)}>
                            <b>{lotName}</b>
                            <p className={classes.metadataInfo}>{lhrName} - Rev {displayRevision}</p>
                          </div>
                        </ArcherElement>
                      );
                    })
                  }
                </div>
              );
            })
          }
        </ArcherContainer>
      </div>
    </>
  );
}
