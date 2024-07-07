import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/useChatStore";
import useUserAuthStore from "@/stores/useUserAuthStore";
import useUserStore from "@/stores/useUserStore";
import { getUserInitials } from "@/utils/userUtils";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ChatWindow = () => {
  const {userId1, userId2} = useParams();
  const { selectedUser } = useUserStore();
  const { messages, sendMessage, fetchHistory, connect } = useChatStore();
  const [newMessage, setNewMessage] = useState("");
  const user = useUserAuthStore((state) => state.user);

  useEffect(() => {
    if (selectedUser) {

      connect(selectedUser.id, user!.id).catch(console.error);
      fetchHistory(selectedUser.id);
    }
  }, [selectedUser, connect, fetchHistory]);

  const handleSend = async () => {
    if (selectedUser && newMessage.trim()) {
      await sendMessage(selectedUser.id.toString(), newMessage.trim());
      setNewMessage(""); 
    } else {
      console.log("Please select a user and type a message.");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-5 flex flex-row space-x-3 justify-center items-center border-b-2 ">
        <Avatar>
          <AvatarImage src={selectedUser?.Avatar} />
          <AvatarFallback>{getUserInitials(selectedUser)}</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-semibold">
          {selectedUser?.name} {selectedUser?.lastName}
        </h1>
      </div>
      <div className="flex-grow overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 ${
              msg.senderId === Number(localStorage.getItem("userId"))
                ? "text-right"
                : "text-left"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      <div className="p-2 flex flex-row justify-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-1 w-1/2"
          placeholder="Type a message..."
        />
        <Button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            <Send className="mr-2 h-4 w-4" />
            Wyślij
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
