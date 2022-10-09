export interface VideoTree {
  _id: string;
  root: VideoNode;
  info: TreeInfo;
  createdAt: string;
}

export interface VideoNode {
  _id: string;
  parentId: string | null;
  layer: number;
  info: NodeInfo | null;
  creator?: string;
  children: VideoNode[];
}

export interface NodeInfo {
  name: string;
  label: string;
  size: number;
  duration: number;
  selectionTimeStart: number;
  selectionTimeEnd: number;
  error: string | null;
  progress: number;
  isConverted: boolean;
  url: string;
}

export interface VideoTreeClient extends VideoTree {
  info: TreeInfoClient;
  data: TreeDataClient;
  history: History | null;
}

export interface TreeInfo {
  creator?: string;
  title: string;
  tags: string[];
  description: string;
  thumbnail: { name: string; url: string };
  size: number;
  maxDuration: number;
  minDuration: number;
  status: 'public' | 'private';
  isEditing: boolean;
}

export interface TreeInfoClient extends TreeInfo {
  creatorInfo: {
    name: string;
    picture: string;
  };
}

export interface TreeData {
  views: number;
  favorites: number;
}

export interface TreeDataClient extends TreeData {
  isFavorite: boolean;
}

export interface History {
  tree: string;
  activeNodeId: string;
  progress: number;
  totalProgress: number;
  isEnded: boolean;
  updatedAt: Date;
}
