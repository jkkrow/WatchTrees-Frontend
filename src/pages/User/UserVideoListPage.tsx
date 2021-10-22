import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';

import NewVideo from 'components/User/UserVideos/Header/NewVideo';
import UserVideoList from 'components/User/UserVideos/List/UserVideoList';
import Modal from 'components/Common/UI/Modal/Modal';
import Input from 'components/Common/Element/Input/Input';
import { useForm } from 'hooks/use-form';
import { initiateUpload } from 'store/actions/upload';
import { VALIDATOR_EQUAL } from 'util/validators';

const ITEMS = [
  {
    _id: Math.random(),
    title: 'test_video_1',
    views: 412341,
    createdAt: new Date().toISOString().substr(0, 10),
    size: 54343435,
    minDuration: 534,
    maxDuration: 1432,
  },

  {
    _id: Math.random(),
    title: 'test_video_2',
    views: 245341,
    createdAt: new Date().toISOString().substr(0, 10),
    size: 134323234,
    minDuration: 655,
    maxDuration: 2466,
  },

  {
    _id: Math.random(),
    title: 'test_video_3',
    views: 65443,
    createdAt: new Date().toISOString().substr(0, 10),
    size: 23432344,
    minDuration: 432,
    maxDuration: 523,
  },

  {
    _id: Math.random(),
    title: 'test_video_4',
    views: 2324,
    createdAt: new Date().toISOString().substr(0, 10),
    size: 234244324,
    minDuration: 778,
    maxDuration: 2463,
  },

  {
    _id: Math.random(),
    title: 'test_video_5',
    views: 867,
    createdAt: new Date().toISOString().substr(0, 10),
    size: 323241321,
    minDuration: 4321,
    maxDuration: 6789,
  },

  {
    _id: Math.random(),
    title: 'test_video_6',
    views: 23983,
    createdAt: new Date().toISOString().substr(0, 10),
    size: 432424242,
    minDuration: 2312,
    maxDuration: 4324,
  },
];

const UserVideoListPage = ({ history }) => {
  const [displayModal, setDisplayModal] = useState(false);
  const [targetItem, setTargetItem] = useState({});

  const { formState, setFormInput } = useForm({
    video: { value: '', isValid: false },
  });

  const dispatch = useDispatch();

  const { uploadTree } = useSelector((state) => state.upload);

  const addNewVideoHandler = () => {
    if (!uploadTree.root) {
      dispatch(initiateUpload());
    }

    history.push('/new-video');
  };

  const openWarningHandler = (item) => {
    setDisplayModal(true);
    setTargetItem(item);
  };

  const closeWarningHandler = () => {
    setDisplayModal(false);
    setTargetItem({});
  };

  const editHandler = () => {
    console.log('EDIT');
  };

  const deleteHandler = () => {
    console.log('DELETE');
  };

  return (
    <>
      <Modal
        on={displayModal}
        data={{
          type: 'DELETE',
          header: 'Delete Video',
          content: (
            <>
              <p>
                To proceed type the video name{' '}
                <strong>{targetItem.title}</strong>.
              </p>
              <Input
                id="video"
                formElement
                validators={[VALIDATOR_EQUAL(targetItem.title)]}
                onForm={setFormInput}
              />
            </>
          ),
          loading: false,
          disabled: !formState.isValid,
        }}
        onConfirm={deleteHandler}
        onClose={closeWarningHandler}
      />
      <div className="layout">
        <NewVideo onAdd={addNewVideoHandler} />
        <UserVideoList
          items={ITEMS}
          onEdit={editHandler}
          onDelete={openWarningHandler}
        />
      </div>
    </>
  );
};

export default UserVideoListPage;
