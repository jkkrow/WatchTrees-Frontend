import { v1 as uuidv1 } from 'uuid';

export interface Node {
  id: string;
  prevId?: string;
  layer: number;
  info: any;
  children: Node[];
}

export interface Tree {
  root: Node;
}

export const createNode = (prevNode?: Node): Node => {
  const node: Node = {
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

export const findById = (tree: Tree, id: string): Node | null => {
  let currentNode: Node = tree.root;
  const queue: Node[] = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift()!;

    if (currentNode.id === id) return currentNode;

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return null;
};

export const findByChildId = (tree: Tree, id: string): Node | null => {
  let currentNode: Node = tree.root;
  const queue: Node[] = [];

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

export const traverseNodes = (root: Node): Node[] => {
  let currentNode = root;
  const queue: Node[] = [];
  const nodes: Node[] = [];

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
  root: Node,
  key: string,
  value?: any,
  type = true
): boolean => {
  const nodes = traverseNodes(root);

  if (key === 'info') {
    return !!nodes.find((node) =>
      type ? node.info === (value || null) : node.info !== (value || null)
    );
  }

  return !!nodes.find((node) => {
    if (!node.info) return false;
    return type ? node.info[key] === value : node.info[key] !== value;
  });
};

export const getAllPaths = (tree: Tree): Node[][] => {
  const result: Node[][] = [];

  const iterate = (currentNode: Node, path: Node[]) => {
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

export const getFullSize = (tree: Tree): number => {
  const nodes = traverseNodes(tree.root);

  return nodes.reduce((acc, cur) => acc + (cur.info?.size ?? 0), 0);
};

export const getMinMaxDuration = (tree: Tree): { max: number; min: number } => {
  const paths = getAllPaths(tree);

  const possibleDurations = paths.map((path) =>
    path.reduce((acc, cur) => acc + (cur.info?.duration ?? 0), 0)
  );

  return {
    max: Math.max(...possibleDurations),
    min: Math.min(...possibleDurations),
  };
};
