import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';

export default function TreeCreator ({ docRevId }: {docRevId: string}) {
  const [data, setData] = React.useState<any[]>();

  const fetchWhereUsedTreesAction = useActionCreator(documentRevisionsActions.fetchWhereUsedTree);
  const fetchWhereUsedTreesAsync = useAsync({
    onSuccess: (treeList) => {
      // console.log(treeList);
      setData(treeList);
    },
  });
  const fetchWhereUsedTree = (docRevId) => {
    fetchWhereUsedTreesAsync.start(fetchWhereUsedTreesAction, docRevId, fetchWhereUsedTreesAsync);
  };

  useEffect(() => {
    fetchWhereUsedTree(docRevId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docRevId]);

  useEffect(() => {
    if (data === undefined) return;
    if (data.length === 1) {
      // It is just this part and has no tree
      return;
    }
    console.log(data);
    const counts = {};
    const root = d3.stratify().id((d: any) => {
      if (!counts[d.name]) {
        counts[d.name] = 1;
        return d.name;
      } else {
        return d.name + ' ' + ++counts[d.name];
      }
    }).parentId((d: any) => d.parentDocId)(data);

    const margin = { top: 20, right: 160, bottom: 30, left: 160 };
    const width = 1080 - margin.left - margin.right;
    const height = 540 - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
    const treemap = d3.tree().size([height, width]);

    //  assigns the data to a hierarchy using parent-child relationships
    // let nodes = d3.hierarchy(root, d => d.children);
    // let nodes = root;

    // maps the node data to the tree layout
    const nodes = treemap(root);

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select('#treeMap').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
    const g = svg.append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

    // adds the links between the nodes
    g.selectAll('.link')
      .data(nodes.descendants().slice(1))
      .enter().append('path')
      .attr('class', 'link')
      .style('stroke', d => d.data.depth)
      .attr('d', d => {
        return 'M' + d.y + ',' + d.x
            + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x
            + ' ' + (d.y + d.parent.y) / 2 + ',' + d.parent.x
            + ' ' + d.parent.y + ',' + d.parent.x;
      });

    // adds each node as a group
    const node = g.selectAll('.node')
      .data(nodes.descendants())
      .enter().append('g')
      .attr('class', d => 'node' + (d.children ? ' node--internal' : ' node--leaf'))
      .attr('transform', d => 'translate(' + d.y + ',' + d.x + ')');

    // adds the circle to the node
    node.append('circle')
      .attr('r', d => d.data.value ?? 4)
      .style('stroke', d => d3.schemeCategory10[d.data.depth])
      .style('fill', d => d3.schemeCategory10[d.data.depth]);

    // adds the text to the node
    node.append('text')
      .attr('dy', '.35em')
      .attr('x', d => { console.log(d); return d.children ? (d.data.depth + 5) * -1 : d.data.depth + 5; })
      .attr('y', d => d.children && d.depth !== 0 ? -(d.data.depth + 5) : d)
      .style('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => `${d.data.name}- Rev${d.data.revision}`);
  }, [data]);

  return (
    <div id="treeMap" />
  );
}
