import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";
export const useChat = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMsgsLoading: false,
  isSendingMsgs: false,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMsgs: async (userId) => {
    set({ isMsgsLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMsgsLoading: false });
    }
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
  sendMsg: async (data) => {
    const { selectedUser, messages } = get();
    set({ isSendingMsgs: true });

    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingMsgs: false });
    }
  },
  subscribeToMsgs: () => {
    const socket = useAuth.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();
      if (
        newMessage.senderId === selectedUser?._id ||
        newMessage.receiverId === selectedUser?._id
      ) {
        set({ messages: [...messages, newMessage] });
      }
    });
  },
  unsubscribeToMsgs: () => {
    const socket = useAuth.getState().socket;
    socket.off("newMessage");
  },
}));
