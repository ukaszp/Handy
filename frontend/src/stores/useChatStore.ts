import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import create from 'zustand';
import useUserAuthStore from './useUserAuthStore';

interface ChatMessage {
  senderId?: number;
  receiverId: string;
  message: string;
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  connection: HubConnection | null;
  connect: (userId1: number, userId2: number) => Promise<void>;
  sendMessage: (receiverUserId: string, message: string) => Promise<void>;
  fetchHistory: (otherUserId: number) => Promise<void>;
  initializeConnection: (userId1: number, userId2: number) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  connection: null,

  addMessage: (message: ChatMessage) => set(state => ({ messages: [...state.messages, message] })),

  initializeConnection: async (userId1, userId2) => {
    const chatIdentifier = [userId1, userId2].sort().join('-');
    console.log(chatIdentifier);
    const connection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7000/chathub/${chatIdentifier}`, {
        accessTokenFactory: () => useUserAuthStore.getState().token || "",
      })
      .withAutomaticReconnect()
      .build();

      try {
        await connection.start();
        console.log("Connected!", connection.connectionId);
        set({ connection });
      } catch (err) {
        console.error("Connection failed: ", err);
      }

      connection.on("LoadComments", (messages: ChatMessage[]) => {
        console.log(messages);
        this.messages = messages;
      });

    connection.on("ReceiveMessage", (message: ChatMessage) => {
      console.log("Message received: ", message);
      get().addMessage(message);
    });

  
  },

  connect: (userId1, userId2) => get().initializeConnection(userId1, userId2),

  sendMessage: async (receiverUserId, message) => {
    const { connection } = get();
    const user = useUserAuthStore.getState().user;

    if (connection && user) {
      try {
        await connection.invoke("SendMessageToUser", receiverUserId, message);
        get().addMessage({
          senderId: user.id,
          receiverId: receiverUserId,
          message: message,
          timestamp: new Date(),
        });
      } catch (err) {
        console.error("Sending message failed: ", err);
      }
    }
  },

  fetchHistory: async (otherUserId) => {
    const { connection } = get();
    if (connection) {
      try {
        const history = await connection.invoke("FetchHistory", otherUserId);
        history.forEach(message => get().addMessage(message));
      } catch (err) {
        console.error("Fetching history failed: ", err);
      }
    }
  },
}));
