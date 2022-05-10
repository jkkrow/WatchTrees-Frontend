import { useState, useRef } from 'react';

import Button from 'components/Common/Element/Button/Button';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import DragDrop from 'components/Upload/DragDrop/DragDrop';
import { ReactComponent as ChangeIcon } from 'assets/icons/reload.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { useAppSelector, useAppThunk } from 'hooks/store-hook';
import { updateUserPicture, deleteUserPicture } from 'store/thunks/user-thunk';
import './EditPicture.scss';

interface EditPictureProps {
  onSuccess: () => void;
}

const EditPicture: React.FC<EditPictureProps> = ({ onSuccess }) => {
  const userData = useAppSelector((state) => state.user.userData);
  const { dispatchThunk, loading } = useAppThunk();

  const [userPicture, setUserPicture] = useState(userData!.picture);
  const [pictureFile, setPictureFile] = useState<File | null>(null);

  const dragDropRef = useRef<HTMLInputElement>(null);

  const fileChangeHandler = (files: File[]) => {
    setPictureFile(files[0]);
    setUserPicture(URL.createObjectURL(files[0]));
  };

  const removePictureHandler = () => {
    setPictureFile(null);
    setUserPicture('');
  };

  const submitPictureHandler = async () => {
    if (userData!.picture === userPicture) return;

    if (!pictureFile) {
      await dispatchThunk(deleteUserPicture());
    } else {
      await dispatchThunk(updateUserPicture(pictureFile));
    }

    onSuccess();
  };

  return (
    <div className="edit-picture">
      <div>
        <DragDrop
          className="edit-picture__drag-drop"
          type="image"
          onFile={fileChangeHandler}
          ref={dragDropRef}
        >
          <Avatar width="100%" height="100%" button src={userPicture} />
        </DragDrop>
        <div className="edit-picture__controls">
          <ChangeIcon
            className="btn"
            style={{ width: '2rem', height: '2rem' }}
            onClick={() => dragDropRef.current?.click()}
          />
          <RemoveIcon
            className="btn"
            style={{ width: '3rem', height: '3rem' }}
            onClick={removePictureHandler}
          />
        </div>
      </div>
      <Button
        disabled={userPicture === userData!.picture}
        loading={loading}
        onClick={submitPictureHandler}
      >
        Save
      </Button>
    </div>
  );
};

export default EditPicture;
