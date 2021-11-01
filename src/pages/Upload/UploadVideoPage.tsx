import UploadDashboard from 'components/Upload/Dashboard/UploadDashboard';
import UploadTree from 'components/Upload/TreeView/Tree/UploadTree';
import Preview from 'components/Upload/Preview/Preview';
import { useAppSelector } from 'hooks/store-hook';

const UploadVideoPage: React.FC = () => {
  const { uploadTree, previewTree } = useAppSelector((state) => state.upload);

  const isPreview = previewTree?.root.info?.url;

  return (
    <div className="layout">
      <div>{uploadTree && <UploadDashboard tree={uploadTree} />}</div>
      <div style={{ display: 'flex' }}>
        {uploadTree && <UploadTree tree={uploadTree} />}
        {isPreview && <Preview tree={previewTree} />}
      </div>
    </div>
  );
};

export default UploadVideoPage;
