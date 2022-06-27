import { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';

import UploadLayout from 'components/Upload/Layout/UploadLayout';
import { useAppSelector } from 'hooks/common/store';

const UploadPage: React.FC = () => {
  const previewTree = useAppSelector((state) => state.upload.previewTree);

  const navigate = useNavigate();

  useEffect(() => {
    !previewTree && navigate('/user/videos');
  }, [previewTree, navigate]);

  return (
    <Fragment>
      <Helmet>
        <title>
          Upload{previewTree?.info.title ? ` - ${previewTree.info.title}` : ''}{' '}
          - WatchTrees
        </title>
      </Helmet>
      {previewTree && <UploadLayout tree={previewTree} />}
    </Fragment>
  );
};

export default UploadPage;
