import UploadNode from '../Node/UploadNode';
import { RenderTree } from 'store/types/upload';
import './UploadTree.scss';

interface UploadTreeProps {
  tree: RenderTree;
}

const UploadTree: React.FC<UploadTreeProps> = ({ tree }) => {
  return (
    <div className="upload-tree">
      <UploadNode currentNode={tree.root} rootId={tree.root._id} />
    </div>
  );
};

export default UploadTree;
