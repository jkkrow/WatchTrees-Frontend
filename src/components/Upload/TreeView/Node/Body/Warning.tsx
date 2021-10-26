import Button from 'components/Common/Element/Button/Button';

interface WarningProps {
  onRemove: () => void;
  onCancel: () => void;
}

const Warning: React.FC<WarningProps> = ({ onRemove, onCancel }) => {
  return (
    <div className="upload-node__warning">
      <div className="upload-node__warning__message">
        This will remove all videos appended to it. Are you sure to proceed?
      </div>
      <div className="upload-node__warning__action">
        <Button onClick={onRemove}>REMOVE</Button>
        <Button onClick={onCancel}>CANCEL</Button>
      </div>
    </div>
  );
};

export default Warning;
