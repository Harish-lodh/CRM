import axiosInstance from "../api/axiosInstance";

export const outlookService = {
   getStatus: () => axiosInstance.get("/api/ms/status"),
  getProfile: () => axiosInstance.get("/api/ms/me"),
  getEvents: () => axiosInstance.get("/api/ms/events"),
  createEvent: (payload) =>
    axiosInstance.post("/api/ms/events", payload),
};
