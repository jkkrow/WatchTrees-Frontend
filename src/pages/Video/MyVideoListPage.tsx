import { useEffect, useState } from 'react';

import MyVideoList from 'components/Video/User/List/MyVideoList';
import UploadButton from 'components/Upload/Button/UploadButton';
import Reload from 'components/Common/UI/Reload/Reload';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import LoadingSpinner from 'components/Common/UI/Loader/LoadingSpinner';
import Modal from 'components/Layout/Modal/Modal';
import Input from 'components/Common/Element/Input/Input';
import { VideoTreeClient } from 'store/slices/video-slice';
import { useForm } from 'hooks/form-hook';
import { usePaginate } from 'hooks/page-hook';
import { useAppThunk } from 'hooks/store-hook';
import { deleteVideo } from 'store/thunks/video-thunk';
import { fetchCreated } from 'store/thunks/video-thunk';
import { VALIDATOR_EQUAL } from 'util/validators';
import 'styles/user.scss';

const MyVideoListPage: React.FC = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [targetItem, setTargetItem] = useState<VideoTreeClient | null>(null);

  const { currentPage, itemsPerPage } = usePaginate(10);

  const { formState, setFormInput } = useForm({
    video: { value: '', isValid: false },
  });

  const { dispatchThunk, reload, data, loading, loaded } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({
    videos: [],
    count: 0,
  });
  const { dispatchThunk: deleteThunk, loading: deleteLoading } = useAppThunk();

  useEffect(() => {
    dispatchThunk(fetchCreated({ page: currentPage, max: itemsPerPage }));
  }, [dispatchThunk, currentPage, itemsPerPage]);

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

    reload();
  };

  return (
    <div className="user-page">
      <Modal
        on={displayModal}
        type="form"
        header="Delete Video"
        footer="DELETE"
        loading={deleteLoading}
        invalid
        disabled={!formState.isValid}
        onConfirm={deleteHandler}
        onClose={closeWarningHandler}
      >
        <div>
          To proceed type the video name{' '}
          <strong>{targetItem?.info.title}</strong>.
        </div>
        <Input
          id="video"
          formInput
          validators={
            targetItem ? [VALIDATOR_EQUAL(targetItem.info.title)] : undefined
          }
          onForm={setFormInput}
        />
      </Modal>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          gap: '1rem',
        }}
      >
        <Reload onReload={() => reload()} />
        <UploadButton />
      </div>
      <LoadingSpinner on={loading} />
      {loaded && (
        <MyVideoList items={data.videos} onDelete={openWarningHandler} />
      )}
      <Pagination
        count={data.count}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default MyVideoListPage;
