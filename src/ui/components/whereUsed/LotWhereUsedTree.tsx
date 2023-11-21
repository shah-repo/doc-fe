import cx from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';

import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import Colors from '../../layout/theme/utils/colors';
import Text from '../Text';
import StatusChip from './StatusChip';
import { IRelation, IWhereUsedLot } from './WhereUsed.interface';
import useStyles from './whereUsedTree.styles';

const DIV_WIDTH = 320;

const Loader = () => {
  const classes = useStyles({ size: undefined });
  return (
    <div data-cy="tree-items-loader" className={classes.loader}>
      <Text translation="common.loading" />
    </div>
  );
};

export default function LotWhereUsedTree ({ lotRevId }: { lotRevId: string }): JSX.Element {
  const [dataInLevels, setDataInLevels] = React.useState<{[key: string]: IWhereUsedLot[]}>();
  const [isLoading, setLoading] = React.useState(true);

  const [relationMap, setRelationMap] = React.useState<{[key: string]: IRelation[]}>();

  const classes = useStyles({ size: undefined });

  const fetchWhereUsedLotTreesAction = useActionCreator(documentRevisionsActions.fetchWhereUsedLotTree);
  const fetchWhereUsedLotTreesAsync = useAsync({
    onSuccess: (treeList: IWhereUsedLot[]| undefined) => {
      if (!treeList || treeList.length === 1) {
        setLoading(false);
        return;
      }

      setDataInLevels(depthMapper(treeList));
      setRelationMap(relationMapper(treeList));
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

  const depthMapper = useMemo(() => (treeList: IWhereUsedLot[]) => {
    const whereUsedDataDepthMap: {[key: string]: IWhereUsedLot[]} = {};
    treeList.forEach((whereUsedEntry: IWhereUsedLot) => {
      const depthToUse = whereUsedEntry.depth.toString();
      if (!whereUsedDataDepthMap[depthToUse]) {
        whereUsedDataDepthMap[depthToUse] = [];
      }
      whereUsedDataDepthMap[depthToUse].push(whereUsedEntry);
    });
    return whereUsedDataDepthMap;
  }, []);

  const relationMapper = useMemo(() => (whereUsedLotData: IWhereUsedLot[]) => {
    const relationMap: {[key: string]: IRelation[]} = {};
    const whereUsedLotMap = {};
    whereUsedLotData.forEach(entry => {
      whereUsedLotMap[`${entry.name}:${entry.depth}`] = entry;
    });

    whereUsedLotData.forEach((whereUsedEntry: IWhereUsedLot) => {
      const childLotRevId = whereUsedEntry.childLotRevId;
      if (childLotRevId) {
        const keyToConsider = `${childLotRevId}:${whereUsedEntry.depth}`;
        if (!relationMap[keyToConsider]) {
          relationMap[keyToConsider] = [];
        }
        relationMap[keyToConsider].push({
          targetId: idGenerator(whereUsedLotMap[`${whereUsedEntry.name}:${whereUsedEntry.depth}`]),
          targetAnchor: 'left',
          sourceAnchor: 'right',
        });
      }
    });
    return relationMap;
  }, []);

  const idGenerator = (entry: IWhereUsedLot) => {
    return `${entry.name}:${entry.childLotRevId}:${entry.depth}:${entry.displayRevision}`;
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={classes.treeMap}>
        <ArcherContainer
          strokeColor={Colors.font_gray}
          svgContainerStyle={{ width: dataInLevels ? Object.keys(dataInLevels).length * DIV_WIDTH : '100%' }}
          strokeWidth={0.75}
        >
          {
            dataInLevels && relationMap && Object.keys(dataInLevels).map((level: string) => {
              const whereUsedEntries = dataInLevels[level];
              return (
                <div className={cx(classes.depthDivLot, classes[`depth-${level}`])} key = {level}>
                  {
                    whereUsedEntries.map(whereUsedEntry => {
                      const { name, lhrName, displayRevision, displayStatus } = whereUsedEntry;
                      return (
                        <ArcherElement
                          id = {idGenerator(whereUsedEntry)}
                          relations= {relationMap[`${whereUsedEntry.lotRevId}:${whereUsedEntry.depth + 1}`] ?? []}
                        >
                          <div
                            className={classes.entry}
                            id={idGenerator(whereUsedEntry)}>
                            <p className={classes.mainContent}>
                              <span className={classes.name}>{name}</span>
                            </p>
                            <p className={classes.metadataInfo}>{lhrName} - Rev {displayRevision}</p>
                            <StatusChip status={displayStatus} />
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
