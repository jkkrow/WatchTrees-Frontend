import UploadNode from '../Node/UploadNode';
import { VideoTree } from 'store/reducers/video-reducer';
import './UploadTree.scss';

interface UploadTreeProps {
  tree: VideoTree;
}

const UploadTree: React.FC<UploadTreeProps> = ({ tree }) => {
  return (
    <div className="upload-tree">
      <UploadNode currentNode={tree.root} treeId={tree.root.id} />
    </div>
  );
};

export default UploadTree;
