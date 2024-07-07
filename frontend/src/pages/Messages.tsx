import Container from '@/components/custom/container';
import ChatWindow from '@/pages/ChatWindow';
import UserList from '@/pages/UserList';
import { useParams } from 'react-router-dom';

const Messages = () => {
 const {userId1, userId2} = useParams();
  return (
    <Container>
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200">
        <UserList />
      </div>
      <div className="w-3/4 bg-white flex flex-col">
        <ChatWindow />
      </div>
    </div>
    </Container>
  );
};

export default Messages;
