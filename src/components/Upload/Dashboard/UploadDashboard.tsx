import { useState, useMemo } from 'react';

import FormModal from 'components/Layout/Modal/Form/FormModal';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import FileInput from 'components/Common/Element/FileInput/FIleInput';
import Radio from 'components/Common/Element/Radio/Radio';
import Tooltip from 'components/Common/UI/Tooltip/Tooltip';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { ReactComponent as EnterIcon } from 'assets/icons/enter.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { ReactComponent as SaveIcon } from 'assets/icons/save.svg';
import { ReactComponent as UndoIcon } from 'assets/icons/undo.svg';
import { useTimeout } from 'hooks/common/timer';
import {
  useAppDispatch,
  useAppSelector,
  useAppThunk,
} from 'hooks/common/store';
import { VideoTree } from 'store/types/video';
import { uploadActions } from 'store/slices/upload-slice';
import {
  saveUpload,
  submitUpload,
  updateThumbnail,
  deleteThumbnail,
} from 'store/thunks/upload-thunk';
import { formatTime, formatSize } from 'util/format';
import { validateNodes } from 'util/tree';
import './UploadDashboard.scss';

interface UploadDashboardProps {
  tree: VideoTree;
}

const UploadDashboard: React.FC<UploadDashboardProps> = ({ tree }) => {
  const isUploadSaved = useAppSelector((state) => state.upload.isUploadSaved);
  const dispatch = useAppDispatch();
  const { dispatchThunk, loading } = useAppThunk();

  const [titleInput, setTitleInput] = useState(tree.info.title);
  const [tagInput, setTagInput] = useState('');
  const [tagArray, setTagArray] = useState(tree.info.tags);
  const [descriptionInput, setDescriptionInput] = useState(
    tree.info.description
  );
  const [isUndoing, setIsUndoing] = useState(false);

  const [setTitleTimeout] = useTimeout();
  const [setDescriptionTimeout] = useTimeout();

  const disableSubmit = useMemo(() => {
    let message: string = '';

    const isEmptyNode = validateNodes(tree.root, 'info');
    const isUncomletedNode = validateNodes(tree.root, 'progress', 100, false);
    const isTitleEmpty = !tree.info.title;

    if (isTitleEmpty) {
      message = 'Title is empty';
    }

    if (isUncomletedNode) {
      message = 'Unfinished process exists';
    }

    if (isEmptyNode) {
      message = 'Empty file exists';
    }

    return message;
  }, [tree.root, tree.info.title]);

  const titleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(event.target.value);

    setTitleTimeout(
      () =>
        dispatch(
          uploadActions.setTree({ info: { title: event.target.value } })
        ),
      300
    );
  };

  const descriptionChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescriptionInput(event.target.value);

    setDescriptionTimeout(
      () =>
        dispatch(
          uploadActions.setTree({ info: { description: event.target.value } })
        ),
      300
    );
  };

  const tagChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const tagSubmitHandler = (event: React.FormEvent | React.MouseEvent) => {
    event.preventDefault();

    const newTag = tagInput.trim();

    if (!newTag.length) return;

    const isDuplicated = tagArray.includes(newTag);

    if (!isDuplicated) {
      const newTags = [...tagArray, newTag];

      setTagArray(newTags);
      dispatch(uploadActions.setTree({ info: { tags: newTags } }));
    }

    setTagInput('');
  };

  const removeTagHandler = (tag: string) => {
    const filteredTags = tagArray.filter((item: string) => item !== tag);

    setTagArray(filteredTags);
    dispatch(uploadActions.setTree({ info: { tags: filteredTags } }));
  };

  const statusChangeHandler = (value: string) => {
    dispatch(
      uploadActions.setTree({ info: { status: value as 'public' | 'private' } })
    );
  };

  const thumbnailChangeHandler = (files: File[]) => {
    dispatchThunk(updateThumbnail(files[0]));
  };

  const thumbnailDeleteHandler = () => {
    dispatchThunk(deleteThumbnail());
  };

  const pendUndoHandler = () => {
    setIsUndoing(true);
  };

  const cancelUndoHandler = () => {
    setIsUndoing(false);
  };

  const confirmUndoHandler = async () => {
    dispatch(uploadActions.finishUpload());
  };

  const saveUploadHandler = () => {
    dispatchThunk(saveUpload());
  };

  const submitUploadHandler = () => {
    dispatchThunk(submitUpload());
  };

  return (
    <div className="upload-dashboard">
      <FormModal
        on={isUndoing}
        header="Undo Upload"
        content="Your upload process is unfinished and the unsaved changes will be lost. Are you sure to continue?"
        footer="Undo"
        onClose={cancelUndoHandler}
        onConfirm={confirmUndoHandler}
      />
      <LoadingSpinner on={loading} overlay />
      <div className="upload-dashboard__header">
        <div className="upload-dashboard__title">
          <Input
            id="title"
            label="Title *"
            value={titleInput}
            onChange={titleChangeHandler}
          />
        </div>
        <div className="upload-dashboard__tag">
          <form
            className="upload-dashboard__tag--input"
            onSubmit={tagSubmitHandler}
          >
            <Input
              id="tag"
              label="Tag"
              value={tagInput}
              onChange={tagChangeHandler}
            />
            <EnterIcon
              className={`btn${!tagInput.trim().length ? ' disabled' : ''}`}
              onClick={tagSubmitHandler}
            />
          </form>
          <div className="upload-dashboard__tag--tags">
            {tagArray.map((item: string) => (
              <div key={item} onClick={() => removeTagHandler(item)}>
                <span>{item}</span>
                <RemoveIcon />
              </div>
            ))}
          </div>
        </div>
        <div className="upload-dashboard__description">
          <Input
            id="description"
            type="textarea"
            label="Description"
            rows={7}
            value={descriptionInput}
            onTextAreaChange={descriptionChangeHandler}
          />
        </div>
      </div>
      <div className="upload-dashboard__body">
        <FileInput
          type="image"
          label="Add thumbnail"
          initialValue={[tree.info.thumbnail]}
          onFileChange={thumbnailChangeHandler}
          onFileDelete={thumbnailDeleteHandler}
        />
        <div className="upload-dashboard__info">
          <div className="upload-dashboard__status" data-label="Status">
            <Radio
              name="video-status"
              options={['public', 'private']}
              initialValue={tree.info.status}
              onRadioChange={statusChangeHandler}
            />
          </div>
          <div className="upload-dashboard__size" data-label="Size">
            {formatSize(tree.info.size)}
          </div>
          <div
            className="upload-dashboard__min-duration"
            data-label="Min Duration"
          >
            {formatTime(tree.info.minDuration)}
          </div>
          <div
            className="upload-dashboard__max-duration"
            data-label="Max Duration"
          >
            {formatTime(tree.info.maxDuration)}
          </div>
        </div>
        <div className="upload-dashboard__buttons">
          <Button inversed onClick={pendUndoHandler}>
            <UndoIcon />
          </Button>
          <Button
            disabled={isUploadSaved || loading}
            onClick={saveUploadHandler}
          >
            <SaveIcon />
          </Button>
          <Tooltip text={disableSubmit} direction="bottom" invalid>
            <Button
              onClick={submitUploadHandler}
              disabled={!!disableSubmit || loading}
            >
              SUBMIT
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default UploadDashboard;
