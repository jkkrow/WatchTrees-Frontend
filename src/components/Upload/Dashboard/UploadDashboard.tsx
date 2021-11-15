import { useState, useMemo } from 'react';

import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import FileInput from 'components/Common/Element/FileInput/FIleInput';
import Radio from 'components/Common/Element/Radio/Radio';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { ReactComponent as EnterIcon } from 'assets/icons/enter.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { ReactComponent as SaveIcon } from 'assets/icons/save.svg';
import { useTimeout } from 'hooks/timer-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoTree, VideoStatus } from 'store/slices/video-slice';
import { uploadActions } from 'store/slices/upload-slice';
import {
  uploadThumbnail,
  deleteThumbnail,
  finishUpload,
} from 'store/thunks/upload-thunk';
import { saveVideo } from 'store/thunks/video-thunk';
import { formatTime, formatSize } from 'util/format';
import { validateNodes } from 'util/tree';
import './UploadDashboard.scss';
import Tooltip from 'components/Common/UI/Tooltip/Tooltip';

interface UploadDashboardProps {
  tree: VideoTree;
}

const UploadDashboard: React.FC<UploadDashboardProps> = ({ tree }) => {
  const { isUploadSaved } = useAppSelector((state) => state.upload);
  const [titleInput, setTitleInput] = useState(tree.title);
  const [descriptionInput, setDescriptionInput] = useState(tree.description);
  const [tagInput, setTagInput] = useState('');
  const [tagArray, setTagArray] = useState(tree.tags);
  const [loading, setLoading] = useState(false);

  const [titleTimeout] = useTimeout();
  const [descriptionTimeout] = useTimeout();

  const dispatch = useAppDispatch();

  const disableSubmit = useMemo(() => {
    let message: string = '';

    const isEmptyNode = validateNodes(tree.root, 'info');
    const isUncomletedNode = validateNodes(tree.root, 'progress', 100, false);
    const isTitleEmpty = !tree.title;

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
  }, [tree.root, tree.title]);

  const titleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(event.target.value);

    titleTimeout(
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

    descriptionTimeout(
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

  const thumbnailChangeHandler = (files: File[]) => {
    dispatch(uploadThumbnail(files[0]));
  };

  const thumbnailDeleteHandler = (fileName: string) => {
    dispatch(deleteThumbnail());
  };

  const statusChangeHandler = (value: string) => {
    dispatch(uploadActions.setTree({ info: { status: value as VideoStatus } }));
  };

  const saveUploadHandler = async () => {
    setLoading(true);

    await dispatch(saveVideo());

    setLoading(false);
  };

  const submitUploadHandler = async () => {
    setLoading(true);

    await dispatch(finishUpload());

    setLoading(false);
  };

  return (
    <div className="upload-dashboard">
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
              className={!tagInput.trim().length ? 'disabled' : ''}
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
          initialValue={[tree.thumbnail]}
          onFileChange={thumbnailChangeHandler}
          onFileDelete={thumbnailDeleteHandler}
        />
        <div className="upload-dashboard__info">
          <div className="upload-dashboard__status" data-label="Status">
            <Radio
              name="video-status"
              options={['public', 'private']}
              initialValue={tree.status}
              onRadioChange={statusChangeHandler}
            />
          </div>
          <div className="upload-dashboard__size" data-label="Size">
            {formatSize(tree.size)}
          </div>
          <div
            className="upload-dashboard__min-duration"
            data-label="Min Duration"
          >
            {formatTime(tree.minDuration)}
          </div>
          <div
            className="upload-dashboard__max-duration"
            data-label="Max Duration"
          >
            {formatTime(tree.maxDuration)}
          </div>
        </div>
        <div className="upload-dashboard__buttons">
          <Button
            disabled={isUploadSaved || loading}
            onClick={saveUploadHandler}
          >
            <SaveIcon
              className="upload-dashboard__save"
              style={{ width: '2.5rem', height: '2.5rem' }}
            />
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
