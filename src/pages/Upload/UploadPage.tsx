import { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';

import UploadLayout from 'components/Upload/Layout/UploadLayout';
import { useAppSelector } from 'hooks/common/store';

const UploadPage: React.FC = () => {
  const renderTree = useAppSelector((state) => state.upload.renderTree);

  const navigate = useNavigate();

  useEffect(() => {
    !renderTree && navigate('/user/videos', { replace: true });
  }, [renderTree, navigate]);

  return (
    <Fragment>
      <Helmet>
        <title>
          Upload{renderTree?.title ? ` - ${renderTree.title}` : ''} - WatchTree
        </title>
      </Helmet>
      {renderTree && <UploadLayout tree={renderTree} />}
    </Fragment>
  );
};

export default UploadPage;
