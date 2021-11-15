import { v1 as uuidv1 } from 'uuid';

import { VideoInfo, VideoNode, VideoTree } from 'store/slices/video-slice';

export const createNode = (prevNode?: VideoNode): VideoNode => {
  const node: VideoNode = {
    id: uuidv1(),
    layer: 0,
    info: null,
    children: [],
  };

  if (prevNode) {
    node.prevId = prevNode.id;
    node.layer = prevNode.layer + 1;
  }

  return node;
};

export const findById = (tree: VideoTree, id: string): VideoNode | null => {
  let currentNode: VideoNode = tree.root;
  const queue: VideoNode[] = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift()!;

    if (currentNode.id === id) return currentNode;

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return null;
};

export const findByChildId = (
  tree: VideoTree,
  id: string
): VideoNode | null => {
  let currentNode: VideoNode = tree.root;
  const queue: VideoNode[] = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift()!;

    if (currentNode.children.find((item) => item?.id === id))
      return currentNode;

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return null;
};

export const traverseNodes = (root: VideoNode): VideoNode[] => {
  let currentNode = root;
  const queue: VideoNode[] = [];
  const nodes: VideoNode[] = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift()!;

    nodes.push(currentNode);

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return nodes;
};

export const validateNodes = (
  root: VideoNode,
  key: keyof VideoInfo | 'info',
  value: any = null,
  type = true
): boolean => {
  const nodes = traverseNodes(root);

  if (key === 'info') {
    return !!nodes.find((node) =>
      type ? node.info === value : node.info !== value
    );
  }

  return !!nodes.find((node) => {
    if (!node.info) return false;
    return type ? node.info[key] === value : node.info[key] !== value;
  });
};

export const getAllPaths = (tree: VideoTree): VideoNode[][] => {
  const result: VideoNode[][] = [];

  const iterate = (currentNode: VideoNode, path: VideoNode[]) => {
    const newPath = path.concat(currentNode);

    if (currentNode.children.length) {
      return currentNode.children.forEach((child) => {
        iterate(child, newPath);
      });
    }

    result.push(newPath);
  };

  iterate(tree.root, []);

  return result;
};

export const getFullSize = (tree: VideoTree): number => {
  const nodes = traverseNodes(tree.root);

  return nodes.reduce((acc, cur) => acc + (cur.info?.size ?? 0), 0);
};

export const getMinMaxDuration = (
  tree: VideoTree
): { max: number; min: number } => {
  const paths = getAllPaths(tree);

  const possibleDurations = paths.map((path) =>
    path.reduce((acc, cur) => acc + (cur.info?.duration ?? 0), 0)
  );

  return {
    max: Math.max(...possibleDurations),
    min: Math.min(...possibleDurations),
  };
};
