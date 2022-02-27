import './NotFound.scss';

interface NotFoundProps {
  text: string;
  icon?: JSX.Element;
}

const NotFound: React.FC<NotFoundProps> = ({ text, icon }) => {
  return (
    <div className="not-found">
      {icon}
      <p>{text}</p>
    </div>
  );
};

export default NotFound;
