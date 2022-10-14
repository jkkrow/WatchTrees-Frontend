export interface Tree {
  _id: string;
  root: Node;
}

export interface Node {
  _id: string;
  parentId: string | null;
  level: number;
  children: Node[];
}

export interface VideoTree extends Tree {
  root: VideoNode;
  title: string;
  tags: string[];
  description: string;
  thumbnail: string;
  size: number;
  maxDuration: number;
  minDuration: number;
  status: 'public' | 'private';
  isEditing: boolean;
  createdAt: string;
}

export interface VideoNode extends Node {
  name: string;
  label: string;
  size: number;
  duration: number;
  selectionTimeStart: number;
  selectionTimeEnd: number;
  url: string;
  children: VideoNode[];
}

export interface VideoTreeClient extends VideoTree {
  creator: {
    id: string;
    name: string;
    picture: string;
  };
  views: number;
  favorites: number;
  isFavorite: boolean;
  history: History | null;
}

export interface History {
  tree: string;
  activeNodeId: string;
  progress: number;
  totalProgress: number;
  isEnded: boolean;
  updatedAt: Date;
}
