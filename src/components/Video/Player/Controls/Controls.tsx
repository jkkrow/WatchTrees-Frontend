import './Controls.scss';

interface ControlsProps {
  hideOn: boolean;
}

const Controls: React.FC<ControlsProps> = ({ hideOn, children }) => {
  return (
    <div className={`vp-controls${hideOn ? ' hide' : ''}`}>{children}</div>
  );
};

export default Controls;
