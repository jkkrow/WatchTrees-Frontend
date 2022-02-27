import { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';

import UploadLayout from 'components/Upload/Layout/UploadLayout';
import UploadDashboard from 'components/Upload/Dashboard/UploadDashboard';
import UploadTree from 'components/Upload/TreeView/Tree/UploadTree';
import UploadPreview from 'components/Upload/Preview/UploadPreview';
import { useAppSelector } from 'hooks/store-hook';

const UploadPage: React.FC = () => {
  const previewTree = useAppSelector((state) => state.upload.previewTree);

  const navigate = useNavigate();

  useEffect(() => {
    !previewTree && navigate('/user/videos');
  }, [previewTree, navigate]);

  const isPreview = previewTree?.root.info?.url;

  return (
    <Fragment>
      <Helmet>
        <title>
          Upload{previewTree?.info.title ? ` - ${previewTree.info.title}` : ''}{' '}
          - WatchTrees
        </title>
      </Helmet>
      <UploadLayout>
        {previewTree && <UploadDashboard tree={previewTree} />}
        {previewTree && <UploadTree tree={previewTree} />}
        {isPreview && <UploadPreview tree={previewTree} />}
      </UploadLayout>
    </Fragment>
  );
};

export default UploadPage;
