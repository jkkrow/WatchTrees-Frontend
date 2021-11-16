import { useState } from 'react';

import UserVideoItem from '../Item/UserVideoItem';
import Modal from 'components/Common/UI/Modal/Modal';
import Input from 'components/Common/Element/Input/Input';
import { useForm } from 'hooks/form-hook';
import { useAppDispatch } from 'hooks/store-hook';
import { VideoTree } from 'store/slices/video-slice';
import { deleteVideo } from 'store/thunks/video-thunk';
import { VALIDATOR_EQUAL } from 'util/validators';
import './UserVideoList.scss';

interface UserVideoListProps {
  items: VideoTree[];
  onDelete: () => void;
}

const UserVideoList: React.FC<UserVideoListProps> = ({ items, onDelete }) => {
  const [displayModal, setDisplayModal] = useState(false);
  const [targetItem, setTargetItem] = useState<VideoTree | null>(null);
  const [loading, setLoading] = useState(false);

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

  const editHandler = () => {
    console.log('EDIT');
  };

  const deleteHandler = async () => {
    if (!targetItem || !targetItem._id) return;

    setLoading(true);

    const success = await dispatch(deleteVideo(targetItem._id));

    setLoading(false);
    success && onDelete();
  };

  return (
    <>
      <Modal
        on={displayModal}
        header="Delete Video"
        content={
          <>
            <p>
              To proceed type the video name{' '}
              <strong>{targetItem?.title}</strong>.
            </p>
            <Input
              id="video"
              formInput
              validators={
                targetItem ? [VALIDATOR_EQUAL(targetItem.title)] : undefined
              }
              onForm={setFormInput}
            />
          </>
        }
        footer="DELETE"
        loading={loading}
        disabled={!formState.isValid}
        invalid
        onConfirm={deleteHandler}
        onClose={closeWarningHandler}
      />
      <ul className="user-video-list">
        {items.map((item) => (
          <UserVideoItem
            key={item._id}
            item={item}
            onEdit={editHandler}
            onDelete={openWarningHandler}
          />
        ))}
      </ul>
      {!items.length && <div className="user-video-list__empty">No Video</div>}
    </>
  );
};

export default UserVideoList;
