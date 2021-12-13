import UploadNode from '../Node/UploadNode';
import { VideoTree } from 'store/slices/video-slice';
import './UploadTree.scss';

interface UploadTreeProps {
  tree: VideoTree;
}

const UploadTree: React.FC<UploadTreeProps> = ({ tree }) => {
  return (
    <div className="upload-tree">
      <UploadNode currentNode={tree.root} rootId={tree.root.id} />
    </div>
  );
};

export default UploadTree;
