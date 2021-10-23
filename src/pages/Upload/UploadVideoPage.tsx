import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import UploadDashboard from 'components/Upload/Dashboard/UploadDashboard';
import UploadTree from 'components/Upload/TreeView/Tree/UploadTree';
import Preview from 'components/Upload/Preview/Preview';
import Modal from 'components/Common/UI/Modal/Modal';
import { RootState } from 'store';
import { removeNode, updateActiveNode, setWarning } from 'store/actions/upload';
import { updateActiveVideo } from 'store/actions/video';

const UploadVideoPage: React.FC = () => {
  const { uploadTree, previewTree, activeNodeId, warning } = useSelector(
    (state: RootState) => state.upload
  );
  const { activeVideoId } = useSelector((state: RootState) => state.video);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setWarning(null));
    };
  }, [dispatch]);

  const removeNodeHandler = (): void => {
    dispatch(removeNode(warning.node.id));

    if (warning.node.id === activeNodeId) {
      dispatch(updateActiveNode(warning.node.prevId));
    }

    if (warning.node.id === activeVideoId) {
      dispatch(updateActiveVideo(warning.node.prevId));
    }
  };

  const confirmHandler = (): void => {
    if (warning.type === 'REMOVE') {
      return removeNodeHandler();
    }
  };

  const closeWarningHandler = (): void => {
    dispatch(setWarning(null));
  };

  return (
    <div className="layout">
      <Modal
        on={!!warning}
        data={warning}
        onConfirm={confirmHandler}
        onClose={closeWarningHandler}
      />
      <div>{uploadTree.root && <UploadDashboard tree={uploadTree} />}</div>
      <div style={{ display: 'flex' }}>
        {uploadTree.root && <UploadTree tree={uploadTree} />}
        {previewTree.root?.info && <Preview tree={previewTree} />}
      </div>
    </div>
  );
};

export default UploadVideoPage;
