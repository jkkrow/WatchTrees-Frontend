import { useState } from 'react';

import UserVideoItem from '../Item/UserVideoItem';
import Modal from 'components/Common/UI/Modal/Modal';
import Input from 'components/Common/Element/Input/Input';
import { useForm } from 'hooks/form-hook';
import { VideoTree } from 'store/reducers/video-reducer';
import { VALIDATOR_EQUAL } from 'util/validators';
import './UserVideoList.scss';

interface UserVideoListProps {
  items: VideoTree[];
}

const UserVideoList: React.FC<UserVideoListProps> = ({ items }) => {
  const [displayModal, setDisplayModal] = useState(false);
  const [targetItem, setTargetItem] = useState<VideoTree | null>(null);

  const { formState, setFormInput } = useForm({
    video: { value: '', isValid: false },
  });

  const openWarningHandler = (item: VideoTree): void => {
    setDisplayModal(true);
    setTargetItem(item);
  };

  const closeWarningHandler = (): void => {
    setDisplayModal(false);
    setTargetItem(null);
  };

  const editHandler = (): void => {
    console.log('EDIT');
  };

  const deleteHandler = (): void => {
    console.log('DELETE');
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
        loading={false}
        disabled={!formState.isValid}
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
