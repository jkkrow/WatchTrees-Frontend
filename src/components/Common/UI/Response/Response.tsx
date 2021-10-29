import './Response.scss';

interface ResponseProps {
  type: 'error' | 'message';
  content: string | null;
}

const Response: React.FC<ResponseProps> = ({ type, content }) =>
  content ? (
    <div className={`response${type === 'error' ? ' error' : ' message'}`}>{content}</div>
  ) : null;

export default Response;
