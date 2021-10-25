import UploadNode from '../Node/UploadNode';
import { UploadTree as UploadTreeType } from 'store/reducers/upload';
import './UploadTree.scss';

interface UploadTreeProps {
  tree: UploadTreeType;
}

const UploadTree: React.FC<UploadTreeProps> = ({ tree }) => {
  return (
    <div className="upload-tree">
      <UploadNode currentNode={tree.root} treeId={tree.root.id} />
    </div>
  );
};

export default UploadTree;
