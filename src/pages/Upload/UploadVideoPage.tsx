import UploadDashboard from 'components/Upload/Dashboard/UploadDashboard';
import UploadTree from 'components/Upload/TreeView/Tree/UploadTree';
import Preview from 'components/Upload/Preview/Preview';
import { useUploadSelector } from 'hooks/store-hook';

const UploadVideoPage: React.FC = () => {
  const { uploadTree, previewTree } = useUploadSelector();

  return (
    <div className="layout">
      <div>{uploadTree && <UploadDashboard tree={uploadTree} />}</div>
      <div style={{ display: 'flex' }}>
        {uploadTree && <UploadTree tree={uploadTree} />}
        {previewTree?.root.info && <Preview tree={previewTree} />}
      </div>
    </div>
  );
};

export default UploadVideoPage;
