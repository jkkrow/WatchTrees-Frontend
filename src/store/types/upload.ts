import { VideoTree } from './video';

export interface UploadTree extends Omit<VideoTree, 'data'> {}
