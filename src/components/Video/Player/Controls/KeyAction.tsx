import { ReactComponent as DoubleArrowLeftIcon } from 'assets/icons/double-arrow-left.svg';
import { ReactComponent as DoubleArrowRightIcon } from 'assets/icons/double-arrow-right.svg';

const KeyAction: React.FC = () => {
  return (
    <div className="vp-key-action">
      <div className="vp-key-action__volume">
        <div></div>
      </div>
      <div className="vp-key-action__skip rewind">
        <DoubleArrowLeftIcon />
      </div>
      <div className="vp-key-action__skip forward">
        <DoubleArrowRightIcon />
      </div>
    </div>
  );
};

export default KeyAction;
