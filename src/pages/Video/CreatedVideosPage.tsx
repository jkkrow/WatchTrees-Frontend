import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import VideoContainer from 'components/Video/Container/VideoContainer';
import CreatedVideoGrid from 'components/Video/Created/Grid/CreatedVideoGrid';
import UploadButton from 'components/Upload/Button/UploadButton';
import Reload from 'components/Common/UI/Reload/Reload';
import FormModal from 'components/Layout/Modal/Form/FormModal';
import Input from 'components/Common/Element/Input/Input';
import { VideoTreeClient } from 'store/slices/video-slice';
import { useForm } from 'hooks/common/form';
import { usePaginate } from 'hooks/common/page';
import {
  useAppThunk,
  useAppDispatch,
  useAppSelector,
} from 'hooks/common/store';
import { uploadActions } from 'store/slices/upload-slice';
import { deleteVideo, fetchCreated } from 'store/thunks/video-thunk';
import { VALIDATOR_EQUAL } from 'util/validators';

const CreatedVideosPage: React.FC = () => {
  const uploadTree = useAppSelector((state) => state.upload.uploadTree);
  const dispatch = useAppDispatch();
  const {
    dispatchThunk: fetchThunk,
    data: fetchData,
    loading: fetchLoading,
    loaded: fetchLoaded,
    reload,
  } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({ videos: [], count: 0 });

  const { dispatchThunk: deleteThunk, loading: deleteLoading } = useAppThunk();

  const [displayModal, setDisplayModal] = useState(false);
  const [targetItem, setTargetItem] = useState<VideoTreeClient | null>(null);

  const { formState, setFormInput } = useForm({
    video: { value: '', isValid: false },
  });

  const { currentPage, pageSize } = usePaginate();

  useEffect(() => {
    fetchThunk(fetchCreated({ page: currentPage, max: pageSize }));
  }, [fetchThunk, currentPage, pageSize]);

  const openWarningHandler = (item: VideoTreeClient) => {
    setDisplayModal(true);
    setTargetItem(item);
  };

  const closeWarningHandler = () => {
    setDisplayModal(false);
    setTargetItem(null);
  };

  const deleteHandler = async () => {
    if (!targetItem || !targetItem._id) return;

    await deleteThunk(deleteVideo(targetItem));

    if (uploadTree && uploadTree._id === targetItem._id) {
      dispatch(uploadActions.finishUpload());
    }

    reload();
  };

  return (
    <Fragment>
      <Helmet>
        <title>Created Videos - WatchTrees</title>
      </Helmet>
      <VideoContainer>
        <FormModal
          on={displayModal}
          header="Delete Video"
          content={
            <>
              <div>
                To proceed, type the video name{' '}
                <strong>{targetItem?.info.title}</strong>.
              </div>
              <Input
                id="video"
                formInput
                validators={
                  targetItem
                    ? [VALIDATOR_EQUAL(targetItem.info.title)]
                    : undefined
                }
                placeholder={targetItem?.info.title}
                onForm={setFormInput}
              />
            </>
          }
          footer="DELETE"
          loading={deleteLoading}
          invalid
          preventEnterSubmit
          disabled={!formState.isValid}
          onConfirm={deleteHandler}
          onClose={closeWarningHandler}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            gap: '1rem',
          }}
        >
          <Reload onReload={reload} />
          <UploadButton />
        </div>
        <CreatedVideoGrid
          data={fetchData}
          loading={fetchLoading}
          loaded={fetchLoaded}
          currentPage={currentPage}
          pageSize={pageSize}
          onDelete={openWarningHandler}
        />
      </VideoContainer>
    </Fragment>
  );
};

export default CreatedVideosPage;
