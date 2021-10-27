import { useState } from 'react';

import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as EnterIcon } from 'assets/icons/enter.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { useTimeout } from 'hooks/timer-hook';
import { useAppDispatch } from 'hooks/store-hook';
import { UploadTree } from 'store/reducers/upload';
import { saveUpload, updateTree } from 'store/actions/upload';
import { formatTime, formatSize } from 'util/format';
import { validateNodes } from 'util/tree';
import './UploadDashboard.scss';

interface UploadDashboardProps {
  tree: UploadTree;
}

const UploadDashboard: React.FC<UploadDashboardProps> = ({ tree }) => {
  const [titleInput, setTitleInput] = useState(tree.title);
  const [descriptionInput, setDescriptionInput] = useState(tree.description);
  const [tagInput, setTagInput] = useState('');
  const [tagArray, setTagArray] = useState(tree.tags);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const [titleTimeout] = useTimeout();
  const [descriptionTimeout] = useTimeout();

  const titleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(event.target.value);

    titleTimeout(
      () => dispatch(updateTree({ title: event.target.value })),
      300
    );
  };

  const descriptionChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescriptionInput(event.target.value);

    descriptionTimeout(
      () => dispatch(updateTree({ description: event.target.value })),
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
      dispatch(updateTree({ tags: newTags }));
    }

    setTagInput('');
  };

  const removeTagHandler = (tag: string) => {
    const filteredTags = tagArray.filter((item: string) => item !== tag);

    setTagArray(filteredTags);
    dispatch(updateTree({ tags: filteredTags }));
  };

  const saveUploadHandler = async () => {
    setLoading(true);

    await dispatch(saveUpload());

    setLoading(false);
  };

  const isEmptyNode = validateNodes(tree.root, 'info');
  const isUncomletedNode = validateNodes(tree.root, 'progress', 100, false);

  return (
    <div className="upload-dashboard">
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
            value={descriptionInput}
            onTextAreaChange={descriptionChangeHandler}
          />
        </div>
      </div>
      {tree.root.info && (
        <div className="upload-dashboard__body">
          <div className="upload-dashboard__info">
            <div className="upload-dashboard__size" data-label="Size">
              {formatSize(tree.size)}
            </div>
            <div
              className="upload-dashboard__min-duration"
              data-label="MinDuration"
            >
              {formatTime(tree.minDuration)}
            </div>
            <div
              className="upload-dashboard__max-duration"
              data-label="MaxDuration"
            >
              {formatTime(tree.maxDuration)}
            </div>
          </div>
          <div className="upload-dashboard__save">
            <Button
              onClick={saveUploadHandler}
              loading={loading}
              disabled={isEmptyNode || isUncomletedNode}
            >
              SAVE
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDashboard;
