import { useCallback, useEffect, useState } from 'react';

import UserLayout from 'components/User/Layout/UserLayout';
import UserVideoHeader from 'components/User/Video/Header/UserVideoHeader';
import UserVideoList from 'components/User/Video/List/UserVideoList';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import Response from 'components/Common/UI/Response/Response';
import Modal from 'components/Common/UI/Modal/Modal';
import Input from 'components/Common/Element/Input/Input';
import { VideoTree } from 'store/slices/video-slice';
import { useForm } from 'hooks/form-hook';
import { usePaginate } from 'hooks/page-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { userActions } from 'store/slices/user-slice';
import { initiateUpload } from 'store/thunks/upload-thunk';
import { deleteVideo } from 'store/thunks/video-thunk';
import { fetchUserVideos } from 'store/thunks/user-thunk';
import { VALIDATOR_EQUAL } from 'util/validators';
import { RouteComponentProps } from 'react-router';

const UserVideoListPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { accessToken, userData } = useAppSelector((state) => state.auth);
  const { uploadTree } = useAppSelector((state) => state.upload);
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

  const addNewVideoHandler = () => {
    if (userData && !userData.isVerified) {
      return dispatch(
        userActions.userFail('You need to verify account before upload video')
      );
    }

    if (!uploadTree) {
      dispatch(initiateUpload());
    }

    history.push('/upload');
  };

  const openWarningHandler = (item: VideoTree) => {
    setDisplayModal(true);
    setTargetItem(item);
  };

  const closeWarningHandler = () => {
    setDisplayModal(false);
    setTargetItem(null);
  };

  const editHandler = () => {
    console.log('EDIT');
  };

  const deleteHandler = async () => {
    if (!targetItem || !targetItem._id) return;

    const success = await dispatch(deleteVideo(targetItem));

    success && fetchVideos();
  };

  const fetchVideos = useCallback(
    async (forceUpdate = true) => {
      const data = await dispatch(
        fetchUserVideos(currentPage, itemsPerPage, forceUpdate)
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
          To proceed type the video name <strong>{targetItem?.title}</strong>.
        </div>
        <Input
          id="video"
          formInput
          validators={
            targetItem ? [VALIDATOR_EQUAL(targetItem.title)] : undefined
          }
          onForm={setFormInput}
        />
      </Modal>
      <UserVideoHeader onReload={fetchVideos} onAdd={addNewVideoHandler} />
      <LoadingSpinner on={loading} />
      <Response type="error" content={error} />
      {!loading && isFetched && (
        <UserVideoList
          items={videos}
          onEdit={editHandler}
          onDelete={openWarningHandler}
        />
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
