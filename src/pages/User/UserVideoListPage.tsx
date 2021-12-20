import { useCallback, useEffect, useState } from 'react';

import UserLayout from 'components/User/Layout/UserLayout';
import UserVideoHeader from 'components/User/Video/Header/UserVideoHeader';
import UserVideoList from 'components/User/Video/List/UserVideoList';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import LoadingSpinner from 'components/Common/UI/Loader/LoadingSpinner';
import Response from 'components/Common/UI/Response/Response';
import Modal from 'components/Common/UI/Modal/Modal';
import Input from 'components/Common/Element/Input/Input';
import { VideoTree } from 'store/slices/video-slice';
import { useForm } from 'hooks/form-hook';
import { usePaginate } from 'hooks/page-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { deleteVideo } from 'store/thunks/video-thunk';
import { fetchMyVideos } from 'store/thunks/user-thunk';
import { VALIDATOR_EQUAL } from 'util/validators';
import { RouteComponentProps } from 'react-router';

const UserVideoListPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { loading, error } = useAppSelector((state) => state.user);

  const [videos, setVideos] = useState([]);
  const [count, setCount] = useState(0);
  const [isFetched, setIsFetched] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [targetItem, setTargetItem] = useState<VideoTree | null>(null);

  const { currentPage, itemsPerPage } = usePaginate(10);

  const { formState, setFormInput } = useForm({
    video: { value: '', isValid: false },
  });

  const dispatch = useAppDispatch();

  const openWarningHandler = (item: VideoTree) => {
    setDisplayModal(true);
    setTargetItem(item);
  };

  const closeWarningHandler = () => {
    setDisplayModal(false);
    setTargetItem(null);
  };

  const deleteHandler = async () => {
    if (!targetItem || !targetItem._id) return;

    const success = await dispatch(deleteVideo(targetItem));

    success && fetchVideos();
  };

  const fetchVideos = useCallback(
    async (forceUpdate = true) => {
      const data = await dispatch(
        fetchMyVideos({ page: currentPage, max: itemsPerPage }, forceUpdate)
      );

      if (data) {
        setIsFetched(true);
        setVideos(data.videos);
        setCount(data.count);
      }
    },
    [dispatch, currentPage, itemsPerPage]
  );

  useEffect(() => {
    if (!accessToken) return;

    fetchVideos(history.action !== 'POP');
  }, [accessToken, fetchVideos, history]);

  return (
    <UserLayout>
      <Modal
        on={displayModal}
        type="form"
        header="Delete Video"
        footer="DELETE"
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
      <UserVideoHeader onReload={fetchVideos} />
      <LoadingSpinner on={loading} />
      <Response type="error" content={error} />
      {!loading && isFetched && (
        <UserVideoList items={videos} onDelete={openWarningHandler} />
      )}
      <Pagination
        count={count}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
    </UserLayout>
  );
};

export default UserVideoListPage;
