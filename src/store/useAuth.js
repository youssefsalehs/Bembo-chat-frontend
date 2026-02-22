import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
export const useAuth = create((set) => ({
  userAuth: null,
  isSigningUp: false,
  isLoging: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ userAuth: res.data });
    } catch (error) {
      console.log("error in check auth", error);
      set({ userAuth: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created suuccessfully");
      set({ userAuth: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoging: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      toast.success("Logged in successfully");
      set({ userAuth: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoging: false });
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ userAuth: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  updateProfile: async (data) => {
    console.log(data);
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch("/auth/update-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ userAuth: res.data.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      // toast.error(error.response.data.message || error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
