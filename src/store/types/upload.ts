import { VideoTree, VideoNode } from './video';

export interface SourceTree extends VideoTree {
  root: SourceNode;
}

export interface RenderTree extends SourceTree {
  root: RenderNode;
}

export interface SourceNode extends VideoNode {
  children: SourceNode[];
}

export interface RenderNode extends SourceNode {
  error: string | null;
  progress: number;
  children: RenderNode[];
}
