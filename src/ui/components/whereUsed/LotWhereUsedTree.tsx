import cx from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';

import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import Colors from '../../layout/theme/utils/colors';
import Text from '../Text';
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
  const [dataInLevels, setDataInLevels] = React.useState<{[key: string]: IWhereUsedLot[]}>();
  const [isLoading, setLoading] = React.useState(true);

  const [relationsMap, setRelationsMap] = React.useState<{[key: string]: IRelation[]}>();

  const classes = useStyles({ size: undefined });

  const fetchWhereUsedLotTreesAction = useActionCreator(documentRevisionsActions.fetchWhereUsedLotTree);
  const fetchWhereUsedLotTreesAsync = useAsync({
    onSuccess: (treeList: IWhereUsedLot[]| undefined) => {
      setDataInLevels(depthMapper(treeList));
      setRelationsMap(relationMapper(treeList));
      setLoading(false);
    },
  });
  const fetchWhereUsedLotTree = (lotRevId: string) => {
    setLoading(true);
    fetchWhereUsedLotTreesAsync.start(fetchWhereUsedLotTreesAction,
      { lotRevIds: [lotRevId], isStatusOnly: false, isFirstLevelOnly: false },
      fetchWhereUsedLotTreesAsync);
  };

  useEffect(() => {
    fetchWhereUsedLotTree(lotRevId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lotRevId]);

  const depthMapper = useMemo(() => (whereUsedLotData: IWhereUsedLot[]| undefined) => {
    if (!whereUsedLotData) {
      return;
    }
    const whereUsedDataDepthMap: {[key: string]: IWhereUsedLot[]} = {};
    whereUsedLotData.forEach((whereUsedEntry: IWhereUsedLot) => {
      const depthToUse = whereUsedEntry.depth.toString();
      if (!whereUsedDataDepthMap[depthToUse]) {
        whereUsedDataDepthMap[depthToUse] = [];
      }
      whereUsedDataDepthMap[depthToUse].push(whereUsedEntry);
    });
    return whereUsedDataDepthMap;
  }, []);

  const relationMapper = useMemo(() => (whereUsedLotData: IWhereUsedLot[]| undefined) => {
    if (!whereUsedLotData) {
      return;
    }
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
    return relationMap;
  }, []);

  const statusClassDecider = (displayStatus: string) => {
    if (displayStatus === DocumentRevisionStatus.Released) {
      return classes.statusReleased;
    } else if (displayStatus === DocumentRevisionStatus.Draft) {
      return classes.statusDraft;
    } else if (displayStatus === DocumentRevisionStatus.PendingChange) {
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
        >
          {
            dataInLevels && relationsMap && Object.keys(dataInLevels).map((level: string) => {
              const whereUsedEntries = dataInLevels[level];
              return (
                <div className={`depthDiv depth-${level}`}>
                  {
                    whereUsedEntries.map(whereUsedEntry => {
                      const { lotName, lhrName, displayRevision, displayStatus } = whereUsedEntry;
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
