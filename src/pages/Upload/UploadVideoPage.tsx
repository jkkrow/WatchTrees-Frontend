import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import UploadDashboard from "components/Upload/Dashboard/UploadDashboard";
import UploadTree from "components/Upload/TreeView/Tree/UploadTree";
import Preview from "components/Upload/Preview/Preview";
import Modal from "components/Common/UI/Modal/Modal";
import { removeNode, updateActiveNode, setWarning } from "store/actions/upload";
import { updateActiveVideo } from "store/actions/video";

const UploadVideoPage = () => {
  const { uploadTree, previewTree, activeNodeId, warning } = useSelector(
    (state) => state.upload
  );
  const { activeVideoId } = useSelector((state) => state.video);

  const dispatch = useDispatch();

  const removeNodeHandler = () => {
    dispatch(removeNode(warning.node.id));

    if (warning.node.id === activeNodeId) {
      dispatch(updateActiveNode(warning.node.prevId));
    }

    if (warning.node.id === activeVideoId) {
      dispatch(updateActiveVideo(warning.node.prevId));
    }
  };

  const confirmHandler = () => {
    if (warning.type === "REMOVE") {
      return removeNodeHandler();
    }
  };

  const closeWarningHandler = () => {
    dispatch(setWarning(null));
  };

  useEffect(() => {
    return () => dispatch(setWarning(null));
  }, [dispatch]);

  return (
    <div className="layout">
      <Modal
        on={warning}
        data={warning}
        onConfirm={confirmHandler}
        onClose={closeWarningHandler}
      />
      <div>{uploadTree.root && <UploadDashboard tree={uploadTree} />}</div>
      <div style={{ display: "flex" }}>
        {uploadTree.root && <UploadTree tree={uploadTree} />}
        {previewTree.root?.info && <Preview tree={previewTree} />}
      </div>
    </div>
  );
};

export default UploadVideoPage;
