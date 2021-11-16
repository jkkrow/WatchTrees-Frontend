import { RouteComponentProps } from 'react-router';

import UploadDashboard from 'components/Upload/Dashboard/UploadDashboard';
import UploadTree from 'components/Upload/TreeView/Tree/UploadTree';
import Preview from 'components/Upload/Preview/Preview';
import { useAppSelector } from 'hooks/store-hook';
import { useEffect } from 'react';

const UploadPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { previewTree } = useAppSelector((state) => state.upload);

  useEffect(() => {
    !previewTree && history.push('/user/videos');
  }, [previewTree, history]);

  const isPreview = previewTree?.root.info?.url;

  return (
    <div className="layout">
      <div>{previewTree && <UploadDashboard tree={previewTree} />}</div>
      <div style={{ display: 'flex' }}>
        {previewTree && <UploadTree tree={previewTree} />}
        {isPreview && <Preview tree={previewTree} />}
      </div>
    </div>
  );
};

export default UploadPage;
