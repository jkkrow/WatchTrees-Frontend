import UploadNode from "../Node/UploadNode";
import "./UploadTree.scss";

const UploadTree = ({ tree }) => {
  return (
    <div className="upload-tree">
      <UploadNode currentNode={tree.root} treeId={tree.root.id} />
    </div>
  );
};

export default UploadTree;
