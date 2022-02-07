import GlobalMessageItem from '../Item/GlobalMessageItem';
import { useAppSelector } from 'hooks/store-hook';
import './GlobalMessageList.scss';

const GlobalMessageList: React.FC = () => {
  const { messages } = useAppSelector((state) => state.ui);

  return (
    <div className="global-message-list">
      {messages.map((message) => (
        <GlobalMessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};

export default GlobalMessageList;
