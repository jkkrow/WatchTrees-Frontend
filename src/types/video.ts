export interface VideoTree {
  _id?: string;
  root: VideoNode;
  title: string;
  tags: string[];
  description: string;
  thumbnail: { name: string; url: string };
  size: number;
  maxDuration: number;
  minDuration: number;
  views: number;
  isEditing: boolean;
  status: VideoStatus;
}

export interface VideoNode {
  id: string;
  prevId?: string;
  layer: number;
  info: VideoInfo | null;
  children: VideoNode[];
}

export interface VideoInfo {
  name: string;
  label: string;
  size: number;
  duration: number;
  timelineStart: number | null;
  timelineEnd: number | null;
  error: string | null;
  progress: number;
  isConverted: boolean;
  url: string;
}

export enum VideoStatus {
  Public = 'public',
  Private = 'private',
}
